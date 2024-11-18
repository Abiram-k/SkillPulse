import { responsive } from "@cloudinary/react";
import axios from "@/axiosIntercepters/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./manageOrder.css";
import { Toast } from "@/Components/Toast";
import { logoutUser } from "@/redux/userSlice";
import AlertDialogueButton from "@/Components/AlertDialogueButton";
import { showToast } from "@/Components/ToastNotification";
import axiosInstance from "@/axiosIntercepters/AxiosInstance";
import Razorpay from "../paymentComoponent/RazorPay";
import { Link } from "react-router-dom";
import { ReturnProduct } from "@/Components/ReturnProduct";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/order?id=${user._id}`);
        console.log(response.data?.orderData, "test");
        setOrders(response.data?.orderData);
      } catch (error) {
        if (error?.response.data.isBlocked) {
          dispatch(logoutUser());
        }
        console.log(error.message);
      }
    })();
  }, [refresh, orders]);

  const handleCancelOrder = async (item) => {
    try {
      const response = await axios.patch(
        `/cancelOrder?id=${user._id}&itemId=${item._id}`
      );
      Toast.fire({
        icon: "success",
        title: `${response.data.message}`,
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `${error?.response?.data.message}`,
      });
    }
  };

  console.log("From fronend", orders);

  const getStatusColor = (status) => {
    if (status == "processing") return "text-yellow-500";
    if (status === "shipped") return "text-blue-500";
    if (status == "delivered") return "text-green-500";
    if (status === "pending") return "text-orange-500";
    if (status === "cancelled") return "text-red-500";
    if (status === "returned") return "text-red-500";
    return "text-gray-500";
  };

  const filteredOrders = search
    ? orders
        .map((order) => {
          const matchesOrderId = order.orderId
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchesFilteredItems = order.orderItems.filter(
            (item) =>
              item.product.productName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              item.product.category.name
                .toLowerCase()
                .includes(search.toLowerCase())
          );

          if (matchesOrderId || matchesFilteredItems.length > 0) {
            return {
              ...order,
              orderItems: matchesOrderId
                ? order.orderItems
                : matchesFilteredItems,
            };
          }
          return null;
        })
        .filter(Boolean)
    : orders;

  const handlePlaceOrder = async (paymentFailed, orderId) => {
    const orderForRetry = orders?.filter(
      (order, index) => order?._id.toString() == orderId
    );
    console.log(orderForRetry, "RETRY ORDER>>>>>");
    try {
      const response = await axiosInstance.post(
        `/order/${user._id}`,
        { checkoutItems: orderForRetry },
        {
          params: {
            isRetryPayment: true,
            paymentFailed,
            paymentMethod: "Razorpay",
            totalAmount: orderForRetry[0]?.totalDiscount,
            appliedCoupon: orderForRetry[0]?.appliedCoupon?._id || null,
          },
        }
      );
      showToast("success", `${response?.data.message}`);
    } catch (error) {
      showToast("error", `${error?.response?.data.message}`);
    }
  };

  const handleReturnProduct = () => {};

  return (
    // <div className="flex">
    <main className="w-full lg:w-full p-4 font-mono h-screen overflow-y-scroll no-scrollbar">
      <h1 className="text-xl lg:text-3xl uppercase font-bold mb-4 lg:mb-14">
        Manage your orders
      </h1>
      <div className="flex flex-col lg:flex-row mb-4 lg:mb-10 transition-all duration-75 gap-2">
        <input
          type="text"
          className="flex-grow p-2 rounded bg-transparent border-2 lg:border-4 text-white border-gray-600 focus:outline-none"
          placeholder="Search your Orders using Order ID, product and category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className="border-y border-gray-500 p-4 rounded-lg shadow-md space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-center text-sm lg:text-base gap-4">
                  <div className="font-medium">
                    Order Date: {order.orderDate}
                  </div>
                  <div
                    className={`font-semibold ${
                      order.paymentStatus != "Failed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status:{" "}
                    {order.paymentStatus != "Failed"
                      ? "Paid"
                      : "Payment Failed"}
                  </div>
                  {order.paymentStatus == "Failed" && (
                    <div className="w-fit max-w-xs mx-auto rounded-md shadow-md">
                      <Razorpay
                        name="Retry"
                        orderId={order?._id}
                        PayAmount={parseInt(order.totalDiscount)}
                        handlePlaceOrder={handlePlaceOrder}
                      />
                    </div>
                  )}
                  <div>Order Number: {order.orderId}</div>
                  <div>Ship To: {order.address.firstName}</div>
                  <div className="font-semibold">
                    Total: ₹{" "}
                    {order.totalDiscount.toFixed(0) ||
                      order.totalAmount.toFixed(0)}
                  </div>
                </div>
                {order.orderItems.map((item) => (
                  <div className="bg-gray-800 p-4 rounded-lg space-y-4 shadow-inner">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                      <img
                        src={
                          `${item.product.productImage[0]}` ||
                          "https://placehold.co/100x100"
                        }
                        alt="Product"
                        className="w-full lg:w-24 lg:h-24 object-cover rounded-md"
                      />
                      <div className="space-y-2">
                        <div className="text-sm lg:text-base">
                          <strong>Category:</strong>{" "}
                          {item.product.category.name}
                        </div>
                        <div className="text-sm lg:text-base">
                          <strong>Total Price:</strong> ₹ {item.totalPrice}{" "}
                          <span className="text-xs">inc GST</span>
                        </div>
                        {order.appliedCoupon && (
                          <div className="text-sm lg:text-base">
                            <strong> Coupon dicount :</strong>
                            <span className=" text-green-500">
                              {" "}
                              ₹{(item.totalPrice - item.price).toFixed(0)}
                            </span>
                          </div>
                        )}
                        <div className="text-sm lg:text-base">
                          <strong>Qty:</strong> {item.quantity}
                        </div>
                        <div className="text-lg lg:text-xl font-semibold">
                          {item.product.productName}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">
                      <div className="text-sm lg:text-base">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`${getStatusColor(item.productStatus)}`}
                        >
                          {item.productStatus}
                        </span>
                      </div>
                      <div className="text-sm lg:text-base">
                        <strong>Date:</strong> {order.orderDate}
                      </div>
                      {item.productStatus !== "shipped" &&
                        item.productStatus !== "delivered" &&
                        item.productStatus !== "cancelled" &&
                        item.productStatus !== "returned" &&
                        order.paymentStatus !== "Failed" && (
                          <div className="flex justify-center items-center bg-red-500 text-white p-2 rounded-md">
                            <AlertDialogueButton
                              name="Cancel"
                              onClick={() => handleCancelOrder(item)}
                            />
                          </div>
                        )}

                      {item.productStatus == "delivered" &&
                        item.returnDescription == "" && (
                          <div className="flex justify-center items-center bg-red-500 text-white p-2 rounded-md">
                            <ReturnProduct item={item} />
                          </div>
                        )}
                      {item.productStatus != "returned" &&
                        item.returnDescription && (
                          <p className="text-orange-600">
                            Return in progress...
                          </p>
                        )}
                      {item.productStatus == "delivered" && (
                        <button
                          className="bg-gray-700 text-white p-2 rounded-md"
                          onClick={handleReturnProduct}
                        >
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h2 className="text-sm lg:text-base">
                No results found for "{search}"
              </h2>
            </div>
          )
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-sm lg:text-base">No orders found</h2>
          </div>
        )}
      </div>
    </main>

    // </div>
  );
};

export default ManageOrders;
