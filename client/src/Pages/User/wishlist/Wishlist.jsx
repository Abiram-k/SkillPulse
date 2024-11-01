import { Toast } from "@/Components/Toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const [wishlist, setwishlist] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const user = useSelector((state) => state.users.user);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3000/wishlist`, {
          withCredentials: true,
        });
        setwishlist(response.data.wishlist);
        console.log("Wishlist Items : ", response.data.wishlist);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data.message}`,
        });
      }
    })();
  }, [trigger]);

  return (
    <main className="p-6 flex justify-center h-screen">
      {wishlist.length > 0 ? (
        <div className="w-full max-w-3xl space-y-6">
          <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
            <i className="fas fa-heart text-red-600"></i>
            <span>My Wishlist (2)</span>
          </div>

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
              <div className="text-xl font-bold mt-2 text-gray-200">
                ₹13,999
              </div>
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
              Add to cart
            </button>
            <i className="fas fa-trash-alt text-gray-400 hover:text-red-600 cursor-pointer"></i>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-6 ">
          <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
            <i className="fas fa-heart text-red-600"></i>
            <span>
              My Wishlist <span className="font-mono">(0)</span>
            </span>
          </div>
          <div className="w-full flex justify-center align-middle">
            <h3 className="font-semibold"> No Items were added yet</h3>
          </div>
        </div>
      )}
    </main>
  );
};

export default Wishlist;
