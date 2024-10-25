import React from "react";

const Wishlist = () => {
  return (
    <main className="p-6 flex justify-center h-screen">
    <div className="w-full max-w-3xl space-y-6">
      {/* Wishlist Header */}
      <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
        <i className="fas fa-heart text-red-600"></i>
        <span>My Wishlist (2)</span>
      </div>
  
      {/* Wishlist Item 1 */}
      <div className="wishlist-item p-6 bg-gray-800 shadow-md rounded-lg flex items-center space-x-6">
        <img
          src="https://placehold.co/100x100"
          alt="Image of Beats Studio Buds Noise Cancelling Bluetooth Truly Wireless In Ear Earbuds With Mic, Ipx4"
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="text-md font-medium">
            (Refurbished) Beats Studio Buds Noise Cancelling Bluetooth Truly
            Wireless In Ear Earbuds With Mic, Ipx4
          </div>
          <div className="text-xl font-bold mt-2 text-gray-200">₹13,999</div>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
          Add to cart
        </button>
        <i className="fas fa-trash-alt text-gray-400 hover:text-red-600 cursor-pointer"></i>
      </div>
  
      {/* Wishlist Item 2 */}
      <div className="wishlist-item p-6 bg-gray-800 shadow-md rounded-lg flex items-center space-x-6">
        <img
          src="https://placehold.co/100x100"
          alt="Image of Beats Studio Buds Noise Cancelling Bluetooth Truly Wireless In Ear Earbuds With Mic, Ipx4"
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="text-md font-medium">
            (Refurbished) Beats Studio Buds Noise Cancelling Bluetooth Truly
            Wireless In Ear Earbuds With Mic, Ipx4
          </div>
          <div className="text-xl font-bold mt-2 text-gray-200">₹13,999</div>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
          Add to cart
        </button>
        <i className="fas fa-trash-alt text-gray-400 hover:text-red-600 cursor-pointer"></i>
      </div>
    </div>
  </main>
  
  );
};

export default Wishlist;
