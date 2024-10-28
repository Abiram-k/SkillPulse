import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeAddress } from "@/Components/ChangeAddress";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState({});

  const checkoutItems = useSelector((state) => state.users.checkoutItems);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [addresses, setAddresses] = useState([]);

  const orderSummary = {
    items: 2,
    subtotal: 22998,
    deliveryCharges: "Free",
    gstAmount: 1030,
    discount: 7208,
    total: 16819.6,
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/address?id=${user?._id}${
            selectedAddressId ? `&addrId=${selectedAddressId}` : ""
          }`
        );
        setAddresses(response.data.addresses);
        // alert(response.data.selectedAddress.address);
        setSelectedAddress(response.data.selectedAddress);
        // localStorage.setItem(
        //   "selectedAddress",
        //   JSON.stringify(response.data.selectedAddress)
        // );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?._id, selectedAddressId]);

  const handleSelectedAddress = (selectedAddress) => {
    setSelectedAddressId(selectedAddress);
  };

  return (
    <div className="min-h-screen bg-black text-white mt-5 font-mono">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between">
          <div className="w-2/3">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold text-red-600 mb-8">CHECKOUT</h1>
              <p className="text-green-500 mt-4">Arrives By Wed, Apr 2024</p>
            </div>
            {checkoutItems.length > 0 ? (
              checkoutItems.map((item) => (
                <div
                  className="flex items-start space-x-4 mb-8"
                  key={item.product._id}
                >
                  <img
                    src={
                      item.product?.productImage[0] ||
                      "/api/placeholder/150/150"
                    }
                    alt="Product"
                    className="w-32 h-32 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.product.productName ||
                        "Pro Based Ear buds, Vortex-continent X-R"}
                    </h3>
                    <p className="text-gray-400">
                      {item.product.productDescription ||
                        "High bass with noise cancellation"}
                    </p>
                    <div className="flex space-x-2">
                      <p className="text-gray-100">
                        {item.product.salesPrice || 999}
                      </p>
                      <p className="text-gray-500 line-through">
                        {item.product.regularPrice || 1999}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="mr-4">Quantity:</span>
                      <span>{item?.quantity}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start space-x-4 mb-8">
                <img
                  src="/api/placeholder/150/150"
                  alt="Product"
                  className="w-32 h-32 object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    Pro Based Ear buds, Vortex-continent X-R
                  </h3>
                  <p className="text-gray-400">
                    High bass with noise cancellation
                  </p>
                  <p className="text-green-500 mt-4">
                    Arrives By Wed, Apr 2024
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="mr-4">Quantity:</span>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-gray-800 rounded px-2 py-1"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <ChangeAddress
                  addresses={addresses}
                  onSelectedAddress={handleSelectedAddress}
                />
              </div>
              {Object.keys(selectedAddress).length === 0 ? (
                <div className="bg-gray-900 p-4 rounded">
                  <Link to={"/user/profile/addNew"} className="lg:p-3 p-2 text-white rounded bg-blue-500 font-semibold">
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="bg-gray-900 p-4 rounded">
                  <div className="mb-4">
                    <p className="font-semibold bg-gray-300 rounded-full px-3 py-1 text-black inline-block text-center">
                      {selectedAddress?.type}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>{selectedAddress?.address}</p>
                    <p>
                      {selectedAddress?.city}, {selectedAddress?.state}
                    </p>
                    <p>{selectedAddress?.pincode}</p>
                    <p>Mobile: +91 {selectedAddress?.mobileNumber}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    // checked={paymentMethod === "card"}
                    // onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Debit Card / Credit card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    // checked={paymentMethod === "upi"}
                    // onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI Method</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked
                    // ={paymentMethod === "cod"}
                    // onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    // checked={paymentMethod === "wallet"}
                    // onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Wallet</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-md w-full">
                Place order
              </button>
              <button className="bg-red-600 text-white px-8 py-3 rounded-md">
                APPLY Coupon
              </button>
            </div>
          </div>
          <div className="w-1/3 pl-8">
            <div className="bg-pink-50 p-6 rounded-lg text-black">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{orderSummary.items} Items</span>
                  <span>{orderSummary.subtotal} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{orderSummary.deliveryCharges}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount</span>
                  <span>{orderSummary.gstAmount} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount 30%</span>
                  <span>-{orderSummary.discount} ₹</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>{orderSummary.total} ₹</span>
                </div>
              </div>
            </div>
            <div className="bg-red-600 p-4 rounded-lg mt-4 text-center flex flex-col items-center">
              <ShoppingCart size={40} />
              <p className="text-white font-bold mt-2">Offers Only For Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
