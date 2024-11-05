import { Toast } from "@/Components/Toast";
import { logoutUser } from "@/redux/userSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Wishlist = () => {
  const [wishlist, setwishlist] = useState({});
  const [trigger, setTrigger] = useState(0);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/wishlist?user=${user._id}`,
          {
            withCredentials: true,
          }
        );                                                                                                                         
        console.log(response.data.wishlist[0]);
        setwishlist(response.data.wishlist);
        console.log("Wishlist Items : ", response.data.wishlist);
      } catch (error) {
        if (error?.response.data.isBlocked) {
          dispatch(logoutUser());
        }
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data?.message}`,
        });
      }
    })();
  }, [trigger]);

  return (
    <main className="p-6 flex justify-center h-screen font-mono">
        <div className="w-full max-w-3xl space-y-6">
            {wishlist.length > 0 ? (
                <>
                    <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
                        <i className="fas fa-heart text-red-600"></i>
                        <span>My Wishlist ({wishlist[0].products.length})</span>
                    </div>
                    
                    {wishlist[0].products.map((product, index) => (
                        <div key={index} className="wishlist-item p-6 bg-gray-800 shadow-md rounded-lg flex items-center space-x-6">
                            <img
                                src={
                                    product.product.productImage[0] ||
                                    "https://placehold.co/100x100"
                                }
                                alt={product.product.productName}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <div className="text-xl mb-3 font-bold">
                                    {product.product.productName}
                                </div>
                                <div className="text-sm">
                                    {product.product.productDescription}
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-xl font-semi-bold mt-2 text-gray-200">
                                        ₹{product.product.salesPrice}
                                    </div>
                                    <div className="text-xl mt-2 text-gray-400 line-through">
                                        ₹{product.product.regularPrice}
                                    </div>
                                </div>
                            </div>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
                                Add to cart
                            </button>
                            <i className="fas fa-trash-alt text-gray-400 hover:text-red-600 cursor-pointer"></i>
                        </div>
                    ))}
                </>
            ) : (
                <div className="w-full max-w-3xl space-y-6">
                    <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
                        <i className="fas fa-heart text-red-600"></i>
                        <span>
                            My Wishlist <span className="font-mono">(0)</span>
                        </span>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <h3 className="font-semibold">No Items were added yet</h3>
                    </div>
                </div>
            )}
        </div>
    </main>
);

};

export default Wishlist;
