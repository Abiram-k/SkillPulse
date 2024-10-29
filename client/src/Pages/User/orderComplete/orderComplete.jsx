import React from "react";

const orderComplete = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
      <div className="bg-gray-800 rounded-full px-6 py-2 mb-4">
        <span className="text-xl font-bold">Order Completed</span>
        <span className="block text-green-500">Arriving By Wed, Apr 2024</span>
      </div>
      <button className="bg-gray-200 text-black rounded-full px-6 py-2 mb-8">
        View order
      </button>
      <div className="text-6xl text-green-500 mb-4">
        <i className="fas fa-check-circle"></i>
      </div>
      <h1 className="text-2xl font-bold mb-2">Your order is Completed</h1>
      <p className="mb-4">
        Thank You for your order, Sit tight we are processing your order we will
        update you with your order in email
      </p>
      <button className="bg-red-600 text-white rounded-full px-6 py-2">
        Continue Shopping
      </button>
    </main>
  );
};

export default orderComplete;
