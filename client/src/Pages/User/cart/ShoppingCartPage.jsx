import React, { useEffect, useState } from "react";
import { Trash2, Search, Heart, ShoppingCart, User, Check } from "lucide-react";
import { Toast } from "@/Components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCartProductQty,
  checkoutItems,
  logoutUser,
} from "@/redux/userSlice";
import AlertDialogueButton from "@/Components/AlertDialogueButton";
import { CouponPopup } from "@/Components/CouponPopup";
import { Button } from "@/Components/ui/button";
import axios from "@/axiosIntercepters/AxiosInstance";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [trigger, setTrigger] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [maxDiscount, setMaxDiscount] = useState("");
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const [selectedCoupons, setSelectedCoupons] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  console.log(user);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/cart/${user._id}`);
        setCartItems(response.data.cartItems);

        console.log("Cart itmes : ", response.data.cartItems);
      } catch (error) {
        if (error?.response.data.isBlocked) {
          dispatch(logoutUser());
        }
        console.log(error);
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data.message}`,
        });
      }
    })();
  }, [trigger]);

  useEffect(() => {
    const productsInfo = [];

    if (cartItems.length > 0 && cartItems[0]?.products) {
      cartItems[0]?.products.forEach((product) => {
        const quantity = product?.quantity || 0;
        productsInfo.push({
          product: product.product?._id,
          quantity,
        });
      });
    }

    if (productsInfo.length > 0) {
      dispatch(setCartProductQty(productsInfo));
    } else {
      console.warn("No valid products found in cartItems.");
    }
  }, [cartItems, dispatch]);

  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`/cartItem/${id}`, {
        params: {
          userId: user._id,
        },
      });
      setTrigger((t) => t + 1);
      setSelectedCoupons("");
      const alreadyHaveProducts =
        JSON.parse(localStorage.getItem(`cart_${user._id}`)) || [];
      const updatedProducts = alreadyHaveProducts.filter(
        (product) => product !== id
      );
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedProducts));
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

  const updateQuantity = async (productId, value) => {
    const item = cartItems[0]?.products.find(
      (item) => item.product._id === productId
    );
    if (item) {
      const newQuantity = item.quantity + value;
      const availableQuantity = item.product.units;

      if (newQuantity >= 1) {
        if (newQuantity <= 5) {
          if (newQuantity <= availableQuantity || value == -1) {
            try {
              const response = await axios.post(
                `/updateQuantity/${productId}`,
                {},
                { params: { userId: user._id, value } }
              );
              setTrigger((t) => t + 1);
            } catch (error) {
              console.log(error);
            }
          } else {
            Toast.fire({
              icon: "error",
              title: `Already added all available (${item.product.units}) stocks`,
            });
          }
        }
      } else {
        const userConfirmed = confirm("Product will remove from your cart");
        let id = productId;
        if (userConfirmed) await removeItem(id);
        else return;
      }
    } else {
      alert("No Cart Item Were Founded");
    }
  };

  const handleCheckout = () => {
    if (cartItems[0].products.length == 0) {
      Toast.fire({
        icon: "error",
        title: `Add some items and checkout`,
      });
    } else {
      dispatch(checkoutItems(cartItems));
      navigate("checkout");
    }
  };

  const handleCouponDelete = async () => {
    try {
      const response = await axios.patch(`/cartCouponRemove/${user._id}`);
      setTrigger((prev) => prev + 1);
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
  const totalPrice = () => {
    return cartItems[0]?.products.reduce(
      (acc, item) => acc + item.product?.salesPrice * item.quantity,
      0
    );
  };

  const calculateDeliveryCharge = () => {
    if (totalPrice() < 1000) return Math.round((2 / 100) * totalPrice());
    else return 0;
  };

  const calculateGST = (gstRate) => {
    return (
      Math.round(
        (gstRate / 100) *
          cartItems[0]?.products.reduce(
            (acc, item) => acc + item.product?.salesPrice * item.quantity,
            0
          )
      ) || 0
    );
  };
  const cartTotalPrice = () => {
    const gstRate = 18;
    const total =
      totalPrice() + calculateGST(gstRate) + calculateDeliveryCharge();
    return total;
  };

  const offerPrice = (couponAmount = 0, couponType) => {
    const totalPrice = cartItems[0]?.products.reduce(
      (acc, item) => acc + item.offeredPrice,
      0
    );
    const gstRate = 18;
    const total =
      totalPrice + calculateGST(gstRate) + calculateDeliveryCharge();
    return total;
  };
  const handleGetSelectedCoupons = async (
    selectedCoupon,
    maxDiscount,
    minPurchaseAmount,
    couponCode
  ) => {
    setSelectedCoupons(selectedCoupon);
    setMaxDiscount(maxDiscount);
    setMinPurchaseAmount(minPurchaseAmount);
    setCouponCode(couponCode);
    try {
      const response = await axios.patch(
        `/cartCouponApply?id=${user._id}&couponId=${selectedCoupon}`
      );
      setTrigger((prev) => prev + 1);
    } catch (error) {
      console.log(error);
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
                  key={item?.product?._id}
                  className="flex items-center bg-gray-900 rounded-lg p-4 space-x-4"
                >
                  <img
                    src={item?.product?.productImage[0] || ""}
                    alt={item?.product?.name}
                    className="w-28 h-28 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg">{item?.product?.productName}</h3>
                    <p className="text-md mt-2">
                      {item?.product?.productDescription}
                    </p>
                    <p className="text-md mt-2">
                      available stock : {item?.product?.units}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-xl mt-2">₹ {item.offeredPrice}</p>
                      {cartItems[0].appliedCoupon &&
                        parseFloat(item.totalPrice - item.offeredPrice) > 0 && (
                          <>
                            <p className="text-xl mt-2 line-through text-gray-400">
                              ₹{item?.product?.salesPrice * item?.quantity}
                            </p>

                            <p className="text-xl mt-2  text-green-400">
                              -₹
                              {item.totalPrice - item.offeredPrice}
                            </p>
                          </>
                        )}
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
                  </div>
                </div>
              ))}
            </div>

            <div className="flex lg:gap-3 gap-1">
              <button
                to={"checkout"}
                className="mt-8 inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
                onClick={handleCheckout}
              >
                Checkout
              </button>
              <Link
                to={"/user/shop"}
                className="mt-8 inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 ">
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
                  <span>{totalPrice()} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">
                    {totalPrice() > 1000
                      ? "Free"
                      : calculateDeliveryCharge() + " ₹"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount (18%)</span>
                  <span>{calculateGST(18)} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount 0%</span>
                  <span>0 ₹</span>
                </div>
                {cartItems[0]?.appliedCoupon && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <span>
                        {cartItems[0].appliedCoupon.couponCode} -(Coupon)
                      </span>
                    </div>
                    <span className="text-green-600">
                      {cartItems[0].appliedCoupon.couponType == "Amount"
                        ? "-" + cartItems[0]?.appliedCoupon.couponAmount
                        : cartItems[0].appliedCoupon.couponAmount + "%"}
                    </span>
                  </div>
                )}
                {cartItems[0]?.appliedCoupon ? (
                  <>
                    <div className="flex justify-between font-bold border-gray-200">
                      <span>Sub Total</span>
                      <span>{cartTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-mono">Saved Amount </span>{" "}
                      <span className="text-green-500">
                        -
                        {cartTotalPrice() -
                          offerPrice(
                            cartItems[0]?.appliedCoupon?.couponAmount,
                            cartItems[0]?.appliedCoupon?.couponType
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                      <span>Payable Amount</span>
                      <span>
                        {offerPrice(
                          cartItems[0]?.appliedCoupon?.couponAmount,
                          cartItems[0]?.appliedCoupon?.couponType
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between font-bold border-gray-200">
                    <span>Payable Amount</span>
                    <span>{cartTotalPrice()}</span>
                  </div>
                )}
              </div>
              {cartItems[0]?.appliedCoupon ? (
                <>
                  <button className="w-full bg-red-200 font-bold  text-green-600 py-2 rounded-lg mt-6  flex items-center justify-around cursor-default">
                    <div className="flex lg:gap-1">
                      Coupon Applied
                      <Check className="text-xs" />{" "}
                    </div>
                    <i
                      className="fas fa-trash cursor-pointer text-red-500 "
                      onClick={() => handleCouponDelete(selectedCoupons)}
                    ></i>
                  </button>
                </>
              ) : (
                <button
                  className="w-full bg-red-600 text-white py-2 rounded-lg mt-6 hover:bg-red-700"
                  onClick={openPopup}
                >
                  APPLY Coupon
                </button>
              )}
              <div className="relative">
                {isPopupOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CouponPopup
                      onClose={closePopup}
                      getCoupons={handleGetSelectedCoupons}
                      totalAmount={totalPrice()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCartPage;
