import axios from "@/axiosIntercepters/AxiosInstance";
import { Toast } from "@/Components/Toast";
import React, { useEffect, useState } from "react";

const CouponManagement = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponAmount, setCouponAmount] = useState("");
  const [description, setDescription] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState({});

  const [coupons, setCoupons] = useState([]);

  const validateForm = () => {
    let error = {};
    if (!couponCode.trim()) error.couponCode = "Required *";
    if (!couponType.trim()) error.couponType = "Required *";
    if (!couponAmount.trim() || isNaN(couponAmount))
      error.couponAmount = "Enter amount";
    if (!description.trim()) error.description = "Required *";
    if (!totalLimit.trim() || isNaN(totalLimit))
      error.totalLimit = "Enter number";
    if (!perUserLimit.trim() || isNaN(perUserLimit))
      error.perUserLimit = "Enter number";
    if (!purchaseAmount.trim() || isNaN(purchaseAmount))
      error.purchaseAmount = "Enter amount";
    if (!expiryDate.trim()) error.expiryDate = "Required *";
    return error;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/admin/coupon");
        console.log(response?.data, "Coupons for management");
        setCoupons(response?.data);
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data?.message}`,
        });
      }
    })();
  }, []);

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
      });
      Toast.fire({
        icon: "success",
        title: `${response?.data.message}`,
      });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `${error?.response?.data?.message}`,
      });
    }
  };
  const getDate = (couponDate) => {
    const date = new Date(couponDate);
    console.log(date);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };

  return (
  <main className="w-full lg:w-7/6 p-8 text-black font-mono mt-0">
  <div className="flex justify-between items-center mb-4">
    <div className="text-2xl font-bold">Coupon Management</div>
  </div>

  <div className="bg-gray-300 p-6 rounded shadow-md">
    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
      <div className="flex items-center space-x-2">
        <span>Sort</span>
        <select className="border p-2 px-4 rounded text-black focus:outline-none">
          <option>Coupon</option>
        </select>
        <span>By</span>
        <select className="border p-2 rounded text-black focus:outline-none">
          <option>Ascending</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="border p-2 px-4 rounded text-black focus:outline-none"
          placeholder="Search by coupon type"
        />
      </div>
    </div>

    <div className="overflow-x-auto max-w-full"> {/* Added max-w-full */}
      <table className="w-full bg-gray-200 rounded shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-black text-left">Code</th>
            <th className="px-6 py-3 text-black text-left">Description</th>
            <th className="px-6 py-3 text-black text-left">Amount</th>
            <th className="px-6 py-3 text-black text-left">Limit</th>
            <th className="px-6 py-3 text-black text-left">Limit/person</th>
            <th className="px-6 py-3 text-black text-left">Min. Purchase</th>
            <th className="px-6 py-3 text-black text-left">Expiry</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr className="border-b">
                <td className="px-6 py-4 text-black">{coupon.couponCode}</td>
                <td className="px-6 py-4 text-black">{coupon.description}</td>
                <td className="px-6 py-4 text-black">{coupon.couponAmount}</td>
                <td className="px-6 py-4 text-black">{coupon.totalLimit}</td>
                <td className="px-6 py-4 text-black">{coupon.perUserLimit}</td>
                <td className="px-6 py-4 text-black">{coupon.purchaseAmount}</td>
                <td className="px-6 py-4 text-black">{getDate(coupon.expirationDate)}</td>
                <td className="px-6 py-4 text-center text-black">
                  <i className="fas fa-times cursor-pointer"></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-black" colSpan="8">
                No coupons available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  <div className="bg-gray-300 p-6 rounded mt-4 shadow-md">
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
          <option value="Percentage ">Percentage (%)</option>
          <option value="Amount ">Amount (₹)</option>
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

    <div className="w-full flex mt-4 justify-center">
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-md"
        onClick={handleAddCoupon}
      >
        Add Coupon
      </button>
    </div>
  </div>
</main>

  );
};

export default CouponManagement;
