import axiosInstance from "@/axiosIntercepters/AxiosInstance";
import React, { useState, useEffect } from "react";

const OrderReport = () => {
  const [filter, setFilter] = useState("Daily");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);

  const filterOrders = () => {
    let filteredData = [];
    const today = new Date();
    const oneDayAgo = new Date(today);
    const oneWeekAgo = new Date(today);
    const oneMonthAgo = new Date(today);

    oneDayAgo.setDate(today.getDate() - 1);
    oneWeekAgo.setDate(today.getDate() - 7);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    switch (filter) {
      case "Daily":
        filteredData = orders?.filter(
          (order) => new Date(order?.orderDate) >= oneDayAgo
        );
        break;
      case "Weekly":
        filteredData = orders?.filter(
          (order) => new Date(order?.orderDate) >= oneWeekAgo
        );
        break;
      case "Monthly":
        filteredData = orders?.filter(
          (order) => new Date(order?.orderDate) >= oneMonthAgo
        );
        break;
      case "Custom":
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          filteredData = orders?.filter(
            (order) =>
              new Date(order?.orderDate) >= start &&
              new Date(order?.orderDate) <= end
          );
        }
        break;
      default:
        filteredData = orders;
    }
    setFilteredOrders(filteredData);
  };

  // Assuming `filteredOrders` contains the list of orders
  const paymentMethodCounts = filteredOrders.reduce((acc, order) => {
    const method = order.paymentMethod;
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  // Assuming `filteredStatus` contains the list of orders
  const orderStatusCount = filteredOrders.reduce((acc, order) => {
    order.orderItems.forEach(
      (item) => (acc[item.productStatus] = (acc[item.productStatus] || 0) + 1)
    );
    return acc;
  }, {});

  useEffect(() => {
    filterOrders();
    (async () => {
      try {
        const response = await axiosInstance("/admin/recentSales");
        setOrders(response?.data?.orders);
        console.log("hellooooo", response?.data?.orders);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [filter]);

  return (
    <div className="p-6 font-mono rounded">
      <h2 className="text-2xl font-bold mb-4 text-black">Order Report</h2>

      <div className="mb-4 flex space-x-4">
        {["Daily", "Weekly", "Monthly", "Custom"].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded ${
              filter === option
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Date Range Picker for Custom Filter */}
      {filter === "Custom" && (
        <div className="mb-4 flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded text-black"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded text-black"
          />
        </div>
      )}

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-black">Order ID</th>
              <th className="px-4 py-2 border text-black">Date</th>
              <th className="px-4 py-2 border text-black">Customer</th>
              <th className="px-4 py-2 border text-black">Payment Method</th>
              <th className="px-4 py-2 border text-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order?.id} className="text-center text-black">
                  <td className="px-4 py-2 border">{order?.orderId}</td>
                  <td className="px-4 py-2 border">{order?.orderDate}</td>
                  <td className="px-4 py-2 border">
                    {order?.user.firstName} {order?.user?.lastName}
                  </td>
                  <td className="px-4 py-2 border">{order?.paymentMethod}</td>
                  <td className="px-4 py-2 border">
                    ₹{order?.totalAmount}
                    {!order?.totalAmount - order?.totalDiscount && (
                      <p className="text-green-400 text-sm font-bold">
                        saved amount:
                        {order?.totalAmount - order?.totalDiscount}
                        <p className="text-orange-500">
                          {" "}
                          {order?.appliedCoupon && "Coupon applied"}
                        </p>
                      </p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 border text-black">
                  No orders found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-gray-100 p-4 rounded shadow flex justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black mb-2">Summary</h3>
          <p className="text-black">Total Orders: {orders?.length}</p>
          <p className="text-black">
            Total Amount: ₹
            {orders.reduce((acc, order, index) => order?.totalAmount + acc, 0)}
          </p>
          <p className="text-black">
            Total Discount: ₹
            {orders.reduce((acc, order, index) => order?.totalAmount + acc, 0) -
              orders.reduce(
                (acc, order, index) => order?.totalDiscount + acc,
                0
              )}
          </p>
          <p className="text-black">
            Total Amount after discount: ₹
            {orders.reduce(
              (acc, order, index) => order?.totalDiscount + acc,
              0
            )}
          </p>
        </div>

        <div className="mt-2">
          <h3 className="text-xl font-semibold text-black mb-2">
            Payment Method Usage
          </h3>
          {Object.keys(paymentMethodCounts).map((method) => (
            <p key={method} className="text-black">
              {method}: {paymentMethodCounts[method]}
            </p>
          ))}
        </div>

        <div className="mt-2">
          <h3 className="text-xl font-semibold text-black mb-2">
            Order Status
          </h3>
          {Object.keys(orderStatusCount).map((method) => (
            <p key={method} className="text-black">
              {method}: {orderStatusCount[method]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderReport;
