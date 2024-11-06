import { Toast } from "@/Components/Toast";
import { logoutUser } from "@/redux/userSlice";
// import axios from "axios";
import axios from "@/axiosIntercepters/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, removeFromWishlist } from "./addRemoveWishlit";
import AlertDialogueButton from "@/Components/AlertDialogueButton";

const Wishlist = () => {
  const [wishlist, setwishlist] = useState({});
  const [trigger, setTrigger] = useState(0);
  const user = useSelector((state) => state.users.user);
  const [cartProduct, setCartProduct] = useState(
    JSON.parse(localStorage.getItem(`cart_${user._id}`)) || []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`wishlist?user=${user._id}`);
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

  const handleDeleteItem = async (product) => {
    try {
      await removeFromWishlist(product, user, dispatch);
      setTrigger((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddToCart = async (id) => {
    try {
      const response = await axios.post(
        `/addToCart/${id}`,
        {},
        {
          params: {
            userId: user._id,
          },
        }
      );
      setCartProduct((prev) => {
        if (!prev.includes(id)) {
          const updatedCart = [...prev, id];
          localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
          return updatedCart;
        }
        return prev;
      });
      setTrigger((prev) => prev + 1);
      Toast.fire({
        icon: "success",
        title: `${response.data.message}`,
      });
    } catch (error) {
      if (error?.response.data.isBlocked) {
        dispatch(logoutUser());
      }
      Toast.fire({
        icon: "error",
        title: `${error?.response?.data?.message}`,
      });
      console.log(error);
    }
  };
  return (
    <main
      className="p-6 flex justify-center h-screen overflow-y-scroll font-mono mb-3"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="w-full max-w-3xl space-y-6">
        {wishlist.length > 0 ? (
          <>
            <div className="wishlist p-6 bg-gray-800 rounded-lg flex items-center space-x-4 justify-center text-xl font-semibold">
              <i className="fas fa-heart text-red-600"></i>
              <span>My Wishlist ({wishlist[0].products.length})</span>
            </div>

            {wishlist[0].products.map((product, index) => (
              <div
                key={index}
                className="wishlist-item p-6 bg-gray-800 shadow-md rounded-lg flex items-center space-x-6"
              >
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
                  <div className="text-sm text-orange-500">
                    {product.product.units == 0 ? "Out of Stock" : ""}
                  </div>
                </div>
                {!cartProduct.includes(product.product._id) ? (
                  <button
                    className={`" ${
                      product.product.units == 0
                        ? "bg-red-800 line-through"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white px-4 py-2 rounded-lg shadow  transition duration-200"`}
                    disabled={product.product.units == 0}
                    onClick={() => handleAddToCart(product.product._id)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
                    Go to Cart
                  </button>
                )}
                <div className="flex gap-2 justify-center align-middle">
                  <AlertDialogueButton
                    name="Delete"
                    onClick={() => handleDeleteItem(product.product._id)}
                  />
                </div>
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
