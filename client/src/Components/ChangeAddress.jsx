import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ChangeAddress = ({ addresses = [], onSelectedAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddress(selectedId);
    if (onSelectedAddress) {
        onSelectedAddress(selectedId);
    }
  };

  useEffect(() => {
    console.log("Received addresses:", addresses);
  }, [addresses]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-yellow">
          Change Address
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900 p-6 rounded-lg shadow-md">
        <SheetHeader className="font-mono">
          <SheetTitle>Select Address</SheetTitle>
          <SheetDescription className="text-gray-600">
            Choose the address you want to use.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center gap-4 p-4 bg-gray-200 rounded-md"
            >
              <Label
                htmlFor={address.address}
                className="text-sm font-semibold text-gray-800"
              >
                {address.address}{" "}
                <span className="text-gray-400">[{address.type}]</span>
              </Label>
              <Input
                type="radio"
                name="address"
                value={address._id}
                checked={selectedAddress === address._id}
                onChange={handleAddressChange}
                className="w-4 h-4"
              />
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              disabled={!selectedAddress}
              className="bg-red-700 text-white"
              // onClick={() =>
              //   // alert("Selected address ID from component:" + selectedAddress)
              // }
            >
              Save Address
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
