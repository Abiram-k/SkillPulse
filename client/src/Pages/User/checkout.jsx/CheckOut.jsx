import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const orderSummary = {
    items: 2,
    subtotal: 22998,
    deliveryCharges: "Free",
    gstAmount: 1030,
    discount: 7208,
    total: 16819.6,
  };

  return (
    <div className="min-h-screen bg-black text-white mt-5 font-mono">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between">
          <div className="w-2/3">
            <h1 className="text-3xl font-bold text-red-600 mb-8">CHECKOUT</h1>

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
                <p className="text-green-500 mt-4">Arrives By Wed, Apr 2024</p>
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

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button className="px-4 py-2 bg-gray-800 rounded">
                  change
                </button>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="font-semibold">Default</p>
                <p>Abhinav,Kuttikatt House</p>
                <p>Thrissur, Kerala</p>
                <p>680 503</p>
                <p>Mobile: +91 9645 801852</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Debit Card / Credit card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI Method</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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

          {/* Order Summary */}
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
                  <span>Total Price</span>
                  <span>{orderSummary.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full text-center py-2 hover:text-gray-300">
                Contact Us
              </button>
              <button className="w-full text-center py-2 hover:text-gray-300">
                Delivery
              </button>
              <button className="w-full text-center py-2 hover:text-gray-300">
                Return & Refund
              </button>
              <button className="w-full text-center py-2 hover:text-gray-300">
                Promotions &Vouchers
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-center mb-2">ACCEPTED PAYMENT METHODS</h3>
              <div className="flex justify-center space-x-2">
                <div className="w-12 h-8 bg-blue-600 rounded"></div>
                <div className="w-12 h-8 bg-red-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white rounded-full">
              <ShoppingCart className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="font-bold">EXPRESS SHIPPING</h3>
              <p className="text-sm text-gray-400">Shipping in 24 Hours</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white rounded-full">
              <ShoppingCart className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="font-bold">SHIPPING TRACKING</h3>
              <p className="text-sm text-gray-400">
                Online order tracking available
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white rounded-full">
              <ShoppingCart className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="font-bold">BUY SAFELY</h3>
              <p className="text-sm text-gray-400">
                Buy safely, any question is here to help!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
