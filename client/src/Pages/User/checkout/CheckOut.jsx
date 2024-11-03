import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeAddress } from "@/Components/ChangeAddress";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Toast } from "@/Components/Toast";
import { logoutUser } from "@/redux/userSlice";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState({});
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const checkoutItems = useSelector((state) => state.users.checkoutItems);
  console.log(checkoutItems, "Check OUt Items");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [addresses, setAddresses] = useState([]);
  const [summary, setSummary] = useState({});

  const totalPrice = () => {
    return checkoutItems[0]?.products.reduce(
      (acc, item) => acc + item.product.salesPrice * item.quantity,
      0
    );
  };
  const calculateDeliveryCharge = () => {
    if (totalPrice() < 1000) return Math.round((2 / 100) * totalPrice());
  };

  const calculateGST = (gstRate) => {
    return Math.round(
      (gstRate / 100) *
        checkoutItems[0]?.products.reduce(
          (acc, item) => acc + item.product.salesPrice * item.quantity,
          0
        )
    );
  };
  const cartTotalPrice = () => {
    const gstRate = 18;
    const total =
      totalPrice() + calculateGST(gstRate) + calculateDeliveryCharge();
    return total;
  };

  const calculations = () => {
    const calcs = {};
    calcs.totalItems = checkoutItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    calcs.totalPrice = checkoutItems.reduce(
      (acc, item) => acc + item.quantity * item.product.salesPrice,
      0
    );

    if (calcs?.totalPrice < 1000)
      calcs.deliveryCharge = Math.round((2 / 100) * calcs.totalPrice);
    else calcs.deliveryCharge = 0;

    calcs.GST = Math.round(
      (18 / 100) *
        checkoutItems.reduce(
          (acc, item) => acc + item.product.salesPrice * item.quantity,
          0
        )
    );

    calcs.checkoutTotal =
      (calcs.totalPrice || 0) + (calcs.deliveryCharge || 0) + (calcs.GST || 0);

    return calcs;
  };

  useEffect(() => {
    const calcs = calculations();

    if (Object.keys(calcs).length > 0) {
      setSummary(calculations());
      return;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/address?id=${user?._id}${
            selectedAddressId ? `&addrId=${selectedAddressId}` : ""
          }`,
          { withCredentials: true }
        );
        setAddresses(response.data.addresses);
        setSelectedAddress(response.data.selectedAddress);
      } catch (error) {
        if (error?.response.data.isBlocked) {
          dispatch(logoutUser());
          Toast.fire({
            icon: "error",
            title: `${error?.response.data.message}`,
          });
        }
        console.log(error);
      }
    })();
  }, [user?._id, selectedAddressId, checkoutComplete]);

  const handleSelectedAddress = (selectedAddress) => {
    setSelectedAddressId(selectedAddress);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/order/${user._id}`,
        checkoutItems,
        { withCredentials: true }
      );
      setCheckoutComplete((prev) => !prev);
      Toast.fire({
        icon: "success",
        title: `${response.data.message}`,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: `${error?.response?.data.message}`,
      });
    }
  };

  return !checkoutComplete ? (
    <div className="min-h-screen bg-black text-white mt-5 font-mono">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3">
            <div className="flex flex-col md:flex-row justify-between">
              <h1 className="text-3xl font-bold text-red-600 mb-4 md:mb-0">
                CHECKOUT
              </h1>
              <p className="text-green-500 mt-2 md:mt-0">
                Arrives By Wed, Apr 2024
              </p>
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
                {addresses.length > 0 && (
                  <ChangeAddress
                    addresses={addresses}
                    onSelectedAddress={handleSelectedAddress}
                  />
                )}
              </div>
              {Object.keys(selectedAddress).length === 0 ? (
                <div className="bg-gray-900 p-4 rounded">
                  <Link
                    to={"/user/profile/addNew"}
                    className="lg:p-3 p-2 text-white rounded bg-blue-500 font-semibold"
                  >
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
                  <input type="radio" name="payment" value="card" />
                  <span>Debit Card / Credit card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="payment" value="upi" />
                  <span>UPI Method</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="payment" value="cod" checked />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="payment" value="wallet" />
                  <span>Wallet</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
              <button
                className="bg-red-600 text-white px-8 py-3 rounded-md w-full mb-4 md:mb-0"
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
              <button className="bg-red-600 text-white px-8 py-3 rounded-md w-full">
                APPLY Coupon
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 mt-6 md:mt-0">
            <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
              Checkout Details
            </div>
            <div className="bg-pink-50 text-black p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{summary.totalItems} Items</span>
                  <span>{summary.totalPrice} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">
                    {summary.totalPrice > 1000
                      ? "Free"
                      : summary.deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount (18%)</span>
                  <span>{summary.GST} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount 0%</span>
                  <span>0 ₹</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                  <span>Total Price</span>
                  <span>{summary.checkoutTotal}</span>
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
  ) : (
    <main className="flex-grow flex flex-col items-center  text-center p-4 h-screen space-y-3.5 lg:mt-28">
      <div className="bg-gray-800 rounded-full px-6 py-2 mb-4">
        <span className="text-xl font-bold">Order Completed</span>
        <span className="block text-green-500 ">Arriving By Wed, Apr 2024</span>
      </div>
      <Link
        to="/user/profile/myOrders"
        className="bg-gray-200 text-black rounded-full px-6 py-2 mb-8"
      >
        View order
      </Link>
      <div className="text-6xl text-green-500 mb-4">
        <i className="fas fa-check-circle"></i>
      </div>
      <h1 className="text-2xl font-bold mb-2">Your order is Completed</h1>
      <p className="mb-4 font-mono">
        Thank You for your order, Sit tight we are processing your order we will
        update you with your order in email
      </p>
      <Link
        to={"/user/profile/shop"}
        className="bg-red-600 text-white rounded-full px-6 py-2"
      >
        Continue Shopping
      </Link>
    </main>
  );
};

export default Checkout;
