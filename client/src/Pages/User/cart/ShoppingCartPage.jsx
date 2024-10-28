import React, { useEffect, useState } from "react";
import { Trash2, Search, Heart, ShoppingCart, User } from "lucide-react";
import axios from "axios";
import { Toast } from "@/Components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkoutItems } from "@/redux/userSlice";
import AlertDialogueButton from "@/Components/AlertDialogueButton";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [trigger, setTrigger] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/cart/${user._id}`
        );
        setCartItems(response.data.cartItems);
        console.log("Cart itmes : ", response.data.cartItems);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data.message}`,
        });
      }
    })();
  }, [trigger]);

  useEffect(() => {
    console.log("Updated cart items:", cartItems);
  }, []);

  const updateQuantityOld = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = async (id) => {
    alert(id);
    alert(user._id);
    setTrigger((t) => t + 1);
    try {
      const response = await axios.delete(
        `http://localhost:3000/cartItem/${id}`,
        {
          withCredentials: true,
          params: {
            userId: user._id,
          },
        }
      );
      Toast.fire({
        icon: "success",
        title: `${response.data.message}`,
      });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `${error?.response?.data.message}`,
      });
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.3;
  const gst = subtotal * 0.05;
  const total = subtotal - discount + gst;

  const updateQuantity = async (productId, value) => {
    setTrigger((t) => t + 1);
    try {
      const response = await axios.post(
        `http://localhost:3000/updateQuantity/${productId}`,
        {},
        { withCredentials: true, params: { userId: user._id, value } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = () => {
    if (cartItems[0].products.length == 0) {
      Toast.fire({
        icon: "error",
        title: `Add some items and checkout`,
      });
    } else {
      // alert("check for data ,sended to checkout");
      // console.log("Data to Checkout", cartItems[0].products);
      dispatch(checkoutItems(cartItems[0]?.products));
      navigate("checkout");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-8 justify-center align-middle">
          <div className="flex-grow max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 mt-3">YOUR CART</h1>
            <p className="mb-8">
              Total {cartItems[0]?.products.length} Items In Your Cart
            </p>
            <div className="space-y-6">
              {cartItems[0]?.products.map((item) => (
                <div
                  key={item?.product._id}
                  className="flex items-center bg-gray-900 rounded-lg p-4 space-x-4"
                >
                  <img
                    src={item?.product.productImage[0] || ""}
                    alt={item?.product.name}
                    className="w-28 h-28 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg">{item?.product.productName}</h3>
                    <p className="text-md mt-2">
                      {item?.product.productDescription}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-xl mt-2">
                        ₹{item?.product.salesPrice.toLocaleString()}
                      </p>
                      <p className="text-xl mt-2 line-through text-gray-400">
                        ₹{item?.product.regularPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item?.product._id, -1)}
                        className="bg-gray-800 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{item?.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item?.product._id, 1)}
                        className="bg-gray-800 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="bg-red-600 p-1 rounded flex space-x-1 justify-center align-middle">
                      <Trash2 className="w-5 h-5" />
                      <AlertDialogueButton
                        name="Delete"
                        onClick={() => removeItem(item?.product._id)}
                      />
                    </div>
                    {/* <button
                      className="text-red-500 hover:text-red-400"
                    > */}
                    {/* <Trash2 className="w-6 h-6" /> */}
                    {/* </button> */}
                  </div>
                </div>
              ))}
            </div>
            <button
              to={"checkout"}
              className="mt-8 inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>

          <div className="w-full md:w-80 my-auto">
            <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
              Checkout Details
            </div>
            <div className="bg-pink-50 text-black p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>
                    {cartItems[0]?.products.reduce(
                      (acc, item) => item.quantity + acc,
                      0
                    )}{" "}
                    Items
                  </span>
                  <span>
                    {cartItems[0]?.products.reduce(
                      (acc, item) => item.quantity * item.product.salesPrice,
                      0
                    )}{" "}
                    ₹
                  </span>
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
