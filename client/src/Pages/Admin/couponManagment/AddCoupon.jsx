import React, { useEffect, useState } from "react";
import axios from "@/axiosIntercepters/AxiosInstance";
import { showToast } from "@/Components/ToastNotification";

function AddCoupon() {
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponAmount, setCouponAmount] = useState("");
  const [description, setDescription] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [message, setMessage] = useState({});

  useEffect(() => {
    setCouponCode("");
    setCouponType("");
    setCouponAmount("");
    setDescription("");
    setTotalLimit("");
    setPerUserLimit("");
    setPurchaseAmount("");
    setExpiryDate("");
    setMaxDiscount("");
    setMessage({});
  }, []);

  const validateForm = () => {
    let error = {};
    if (!couponCode.trim()) error.couponCode = "Required *";
    if (!couponType.trim()) error.couponType = "Required *";

    if (!couponAmount.trim() || isNaN(couponAmount))
      error.couponAmount = "Enter amount";
    if (couponAmount < 0) error.couponAmount = "Must be positive value *";

    if (!description.trim()) error.description = "Required *";
    if (!totalLimit.trim() || isNaN(totalLimit))
      error.totalLimit = "Enter number";
    if (totalLimit < 0) error.totalLimit = "Must be positive value *";
    if (!perUserLimit.trim() || isNaN(perUserLimit))
      error.perUserLimit = "Enter number";

    if (!purchaseAmount.trim() || isNaN(purchaseAmount))
      error.purchaseAmount = "Enter amount";
    if (purchaseAmount < 0) error.purchaseAmount = "Must be positive value *";
    if (
      couponType == "Amount" &&
      parseInt(purchaseAmount) < parseInt(couponAmount)
    )
      error.purchaseAmount =
        "purchase amount must be greater than coupon Amount";

    if (!maxDiscount.trim() || isNaN(maxDiscount))
      error.maxDiscount = "Enter amount";
    if (maxDiscount < 0) error.maxDiscount = "Must be posetive value *";

    if (couponType == "Amount" && couponAmount != maxDiscount)
      error.maxDiscount = "Field must be same as coupon Amount*";

    if (!expiryDate.trim()) error.expiryDate = "Required *";
    if (new Date(expiryDate) <= new Date()) {
      error.expiryDate = "Expiry must be after creation *";
    }
    if (couponType == "Percentage" && couponAmount > 100)
      error.couponAmount = "Enter valid coupon percentage";

    return error;
  };

  const handleAddCoupon = async () => {
    setMessage({});
    const formError = validateForm();
    if (Object.keys(formError).length > 0) {
      setMessage(formError);
      return;
    }
    try {
      const response = await axios.post("/admin/coupon", {
        couponCode,
        couponType,
        couponAmount,
        description,
        totalLimit,
        perUserLimit,
        purchaseAmount,
        expiryDate,
        maxDiscount,
      });
      setCouponCode("");
      setCouponType("");
      setCouponAmount("");
      setDescription("");
      setTotalLimit("");
      setPerUserLimit("");
      setPurchaseAmount("");
      setExpiryDate("");
      setMaxDiscount("");
      setMessage({});
      showToast("success", `${response?.data.message}`);
    } catch (error) {
      showToast("error", `${error?.response?.data?.message}`);
    }
  };
  return (
    <div>
      <div className="bg-gray-300 p-6 rounded mt-4 shadow-md font-mono">
        <h2 className="text-xl font-bold mb-4 text-black">Add Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            {message.couponCode && (
              <p className="ps-3 text-red-600">{message.couponCode}</p>
            )}
          </div>
          <div className="space-y-2">
            <select
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Coupon Type"
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
            >
              <option value="" disabled>
                Payment type
              </option>
              <option value="Percentage">Percentage (%)</option>
              <option value="Amount">Amount (₹)</option>
            </select>
            {message.couponType && (
              <p className="ps-3 text-red-600">{message.couponType}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Coupon Amount"
              value={couponAmount}
              onChange={(e) => setCouponAmount(e.target.value)}
            />
            {message.couponAmount && (
              <p className="ps-3 text-red-600">{message.couponAmount}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {message.description && (
              <p className="ps-3 text-red-600">{message.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Total Limit"
              value={totalLimit}
              onChange={(e) => setTotalLimit(e.target.value)}
            />
            {message.totalLimit && (
              <p className="ps-3 text-red-600">{message.totalLimit}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Per User Limit"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
            />
            {message.perUserLimit && (
              <p className="ps-3 text-red-600">{message.perUserLimit}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Purchase Amount"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
            />
            {message.purchaseAmount && (
              <p className="ps-3 text-red-600">{message.purchaseAmount}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="max Discount"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
            {message.maxDiscount && (
              <p className="ps-3 text-red-600">{message.maxDiscount}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="date"
              className="border p-3 rounded text-black focus:outline-none w-full"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            {message.expiryDate && (
              <p className="ps-3 text-red-600">{message.expiryDate}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-green-500  hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-md"
            onClick={handleAddCoupon}
          >
            + Add Coupon
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCoupon;
