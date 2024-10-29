import { responsive } from "@cloudinary/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ManageOrders = () => {
  const [orders, setOrders] = useState({});
  const [search, setSearch] = useState("");

  const user = useSelector((state) => state.users.user);

  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/order?id=${user._id}`
        );
        console.log(response.data?.orderData, "test");
        setOrders(response.data?.orderData);
        // alert(response.data.message);
        // alert("hey");
      } catch (error) {
        console.log(error.message);
        alert(error?.response.data.message);
      }
    })();
  }, []);

  const handleCancelOrder = async () => {
    const response = axios.post(`http://localhost:3000/cancelOrder?id=${user._id}`);
  };
  console.log("From fronend", orders);
  return (
    // <div className="flex">
    <main className="w-3/4 p-4 font-mono">
      <h1 className="text-2xl lg:text-3xl uppercase font-bold mb-4 lg:mb-14 ">
        Manage your orders
      </h1>
      <div className="flex mb-4 lg:mb-10 transition-all duration-75">
        <input
          type="text"
          className="flex-grow p-2 rounded bg-transparent border-4 text-white border-gray-600 focus:outline-none focus:scale-105 transition-all duration-200"
          placeholder="Search your Orders using Order ID "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <button className="bg-red-500 p-2 ">Search</button> */}
      </div>

      <div className="space-y-4">
        {Object.keys(orders).length > 0 ? (
          orders.orderItems.map((item) => (
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex justify-between mb-2">
                <div>Order Date: {orders.orderDate}</div>
                <div>Order Number: {orders.orderId}</div>
                <div>Ship To: {orders.address.firstName}</div>
                <div>Total: ₹ {item.price}</div>
              </div>
              <div className="flex">
                <img
                  src={
                    `${item.product.productImage[0]}` ||
                    "https://placehold.co/100x100"
                  }
                  alt="Image of boAt Immortal 131 with Beast Mode"
                  className="w-24 h-24 mr-4"
                />
                <div>
                  <div>Category: {item.product.category.name}</div>

                  <div>
                    Price: ₹ {item.product.salesPrice}{" "}
                    <span className="text-xs">inc GST</span>
                  </div>
                  <div>Qty: {item.quantity} </div>
                  <div className="text-xl">
                    {item.product.productDescription}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div>
                  Status:{" "}
                  <span className="text-yellow-500">{item.productStatus}</span>
                </div>
                <div>Date: {orders.orderDate}</div>
                <button
                  className="bg-red-500 p-2 rounded"
                  onClick={handleCancelOrder}
                >
                  Cancel
                </button>
                <button className="bg-gray-700 p-2 rounded">Invoice</button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-800 p-4 rounded">
            <h2>NO Orders founded</h2>
          </div>
        )}
      </div>
    </main>
    // </div>
  );
};

export default ManageOrders;
