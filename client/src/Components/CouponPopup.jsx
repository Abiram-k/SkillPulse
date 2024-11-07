import React, { useEffect, useState } from "react";
import { X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";  // Import useToast here
import axios from "@/axiosIntercepters/AxiosInstance";

export const CouponPopup = ({ onClose, getCoupons }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const { toast } = useToast();  // Access toast from useToast

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("/coupon");
        console.log(response?.data, "Coupons for management");
        setCoupons(response?.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to fetch coupons.",
          variant: "destructive"
        });
      }
    };
    fetchCoupons();
  }, [toast]);

  const handleSelectedCoupon = (value) => {
    setSelectedCoupon(value);
  };

  const handleApply = () => {
    getCoupons(selectedCoupon);

    if (selectedCoupon) {
      const coupon = coupons.find((c) => c._id === selectedCoupon);
      if (coupon) {
        toast({
          title: "Coupon Applied",
          description: `${coupon.couponCode} - ${coupon.description}`,
        });
        onClose();
      }
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Coupon Copied",
      description: `${code} has been copied to your clipboard.`,
    });
  };

  return (
    <Card className="w-[550px] relative bg-gray-100 p-6 rounded-lg shadow-lg">
      <Button
        className="absolute top-2 right-2 text-gray-700"
        variant="ghost"
        size="icon"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="text-gray-900">
        <CardTitle>Available Coupons</CardTitle>
        <CardDescription>
          Select a coupon to apply to your order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedCoupon || ""}
          onValueChange={handleSelectedCoupon}
          className="bg-gray-200 p-4 rounded-lg space-y-4"
        >
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={coupon._id}
                  id={coupon._id}
                  className="bg-white border-gray-300"
                />
                <Label htmlFor={coupon._id} className="cursor-pointer">
                  <span className="font-semibold text-lg text-gray-800">
                    {coupon.couponCode}
                  </span>
                  <span className="block text-sm text-gray-600">
                    {coupon.description}
                  </span>
                </Label>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(coupon.couponCode)}
                className="text-gray-600 border-gray-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setSelectedCoupon(null)}
          className="text-gray-600 border-gray-300"
        >
          Clear
        </Button>
        <Button
          onClick={handleApply}
          disabled={!selectedCoupon}
          className="text-white bg-green-600 hover:bg-green-700"
        >
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
};
