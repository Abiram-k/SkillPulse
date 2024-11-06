import { responsive } from "@cloudinary/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./manageOrder.css";
import { Toast } from "@/Components/Toast";
import { logoutUser } from "@/redux/userSlice";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/order?id=${user._id}`,
          { withCredentials: true }
        );
        console.log(response.data?.orderData, "test");
        setOrders(response.data?.orderData);
      } catch (error) {
        if (error?.response.data.isBlocked) {
          dispatch(logoutUser());
        }
        console.log(error.message);
      }
    })();
  }, [refresh]);

  const handleCancelOrder = async (item) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/cancelOrder?id=${user._id}&itemId=${item._id}`,
        {},
        { withCredentials: true }
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
  const handleReturnOrder = async (item) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/ReturnOrder?id=${user._id}&itemId=${item._id}`,
        {},
        { withCredentials: true }
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
  
    <div className="space-y-4">
      {orders.length > 0 ? (
        filteredOrders.length > 0 ? (
          filteredOrders.map((orders) =>
            orders.orderItems.map((item) => (
              <div className="bg-gray-800 p-4 rounded">
                <div className="flex flex-col lg:flex-row justify-between mb-2 gap-2 text-sm lg:text-base">
                  <div>Order Date: {orders.orderDate}</div>
                  <div>Order Number: {orders.orderId}</div>
                  <div>Ship To: {orders.address.firstName}</div>
                  <div>Total: ₹ {item.price}</div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <img
                    src={
                      `${item.product.productImage[0]}` ||
                      "https://placehold.co/100x100"
                    }
                    alt="Product"
                    className="w-full lg:w-24 lg:h-24 object-cover"
                  />
                  <div>
                    <div className="text-sm lg:text-base">
                      Category: {item.product.category.name}
                    </div>
                    <div className="text-sm lg:text-base">
                      Price: ₹ {item.product.salesPrice}{" "}
                      <span className="text-xs">inc GST</span>
                    </div>
                    <div className="text-sm lg:text-base">
                      Qty: {item.quantity}
                    </div>
                    <div className="text-lg lg:text-xl font-semibold">
                      {item.product.productName}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between mt-2 gap-2">
                  <div className="text-sm lg:text-base">
                    Status:{" "}
                    <span className={`${getStatusColor(item.productStatus)}`}>
                      {item.productStatus}
                    </span>
                  </div>
                  <div className="text-sm lg:text-base">
                    Date: {orders.orderDate}
                  </div>
                  {item.productStatus !== "shipped" &&
                    item.productStatus !== "delivered" &&
                    item.productStatus !== "cancelled" &&
                    item.productStatus !== "returned" && (
                      <button
                        className="bg-red-500 p-2 rounded text-xs lg:text-sm"
                        onClick={() => handleCancelOrder(item)}
                      >
                        Cancel
                      </button>
                    )}
                  {item.productStatus === "delivered" && (
                    <button
                      className="bg-red-500 p-2 rounded text-xs lg:text-sm"
                      onClick={() => handleReturnOrder(item)}
                    >
                      Return
                    </button>
                  )}
                  <button className="bg-gray-700 p-2 rounded text-xs lg:text-sm">
                    Invoice
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-sm lg:text-base">"{search}" not found</h2>
          </div>
        )
      ) : (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-sm lg:text-base">No orders found</h2>
        </div>
      )}
    </div>
  </main>
  
    // </div>
  );
};

export default ManageOrders;
