import React, { useState } from "react";
import { Trash2, Search, Heart, ShoppingCart, User } from "lucide-react";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Apple Beats Fit Pro - True Wireless Noise Cancelling Earbuds",
      price: 11999,
      quantity: 1,
      image: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "Gaming Keyboard",
      price: 9999,
      quantity: 1,
      image: "/api/placeholder/100/100",
    },
    {
      id: 1,
      name: "Apple Beats Fit Pro - True Wireless Noise Cancelling Earbuds",
      price: 11999,
      quantity: 1,
      image: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "Gaming Keyboard",
      price: 9999,
      quantity: 1,
      image: "/api/placeholder/100/100",
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.3;
  const gst = subtotal * 0.05;
  const total = subtotal - discount + gst;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-8">
          <div className="flex-grow">
            <h1 className="text-4xl font-bold mb-6 mt-3">YOUR CART</h1>
            <p className="mb-8">Total {cartItems.length} Items In Your Cart</p>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg">{item.name}</h3>
                      <p className="text-xl mt-2">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-800 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-800 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700">
              Checkout
            </button>
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-80">
            <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
              Checkout Details
            </div>
            <div className="bg-pink-50 text-black p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{cartItems.length} Items</span>
                  <span>{subtotal.toLocaleString()} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount</span>
                  <span>{gst.toLocaleString()} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount 30%</span>
                  <span>-{discount.toLocaleString()} ₹</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                  <span>Total Price</span>
                  <span>{total.toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg mt-6 hover:bg-red-700">
                APPLY Coupon
              </button>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default ShoppingCartPage;
