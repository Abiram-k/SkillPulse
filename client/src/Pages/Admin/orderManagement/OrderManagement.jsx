import React, { useEffect, useState } from "react";
import {
  Bell,
  User,
  LayoutGrid,
  Users,
  Package,
  Image as ImageIcon,
  Tag,
  CreditCard,
  Package2,
  Percent,
  Settings,
  LogOut,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ChangeStatus } from "@/Components/ChangeStatus";
import { logoutAdmin } from "@/redux/adminSlice";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/order`, {
          withCredentials: true,
        });
        console.log(response.data?.orderData, "test");
        setOrders(response.data?.orderData);
      } catch (error) {
        if (error?.response.data.message == "Token not found") {
          dispatch(logoutAdmin());
        }
        console.log(error.message);
        alert(error?.response.data.message);
      }
    })();
  }, [orders]);

  const handleUpdatedStatus = (status) => {
    if (status) setUpdatedStatus(status);
  };

  const handleCancelOrder = async () => {
    const response = axios.post(
      `http://localhost:3000/cancelOrder?id=${user._id}`
    );
  };
  console.log("From fronend", orders);

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

  const getStatusColor = (status) => {
    if (status === "processing") return "text-yellow-500";
    if (status === "shipped") return "text-blue-500";
    if (status === "delivered") return "text-green-500";
    if (status === "pending") return "text-orange-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="flex min-h-screen bg-black font-mono">
      <div className="flex-1 bg-black">
        <main className="p-6">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-2xl font-bold text-white"></h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white">Sort</span>
                <select className="bg-transparent border border-gray-700 rounded px-2 py-1 text-white">
                  <option disabled>Select One</option>
                  <option className="text-black">A - Z</option>
                  <option className="text-black">Z - A</option>
                  <option className="text-black">Recent</option>
                  <option className="text-black">Oldest</option>
                </select>
                <span className="text-white">By</span>
                <select className="bg-transparent border border-gray-700 rounded px-2 py-1 text-white">
                  <option disabled>Select One</option>
                  <option className="text-black">Price-Ascending</option>
                  <option className="text-black">Price-Descending</option>
                </select>
              </div>
              <select className="bg-transparent border border-gray-700 rounded px-2 py-1 text-white">
                <option disabled>Filter</option>
                <option className="text-black">Canceled</option>
                <option className="text-black">shipped</option>
                <option className="text-black">processing</option>
                <option className="text-black">delivered</option>
                <option className="text-black">cancelled</option>

              </select>
              {/* <button className="bg-gray-100 text- px-4 py-2 rounded">
                MORE DETAILS
              </button> */}
            </div>
          </div>

          <div className="bg-black rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white text-lg">
                  <th className="px-6 py-3 text-left">ORDER ID</th>
                  <th className="px-6 py-3 text-left">PRODUCT</th>
                  <th className="px-4 py-3 text-left">ORDER DATE</th>
                  <th className="px-6 py-3 text-left">PRICE</th>
                  <th className="px-6 py-3 text-left">ADDRESS</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.orderItems.map((item, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-200">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {item.product?.productName} x ({item.quantity})
                      </td>
                      <td className="px-6 py-4 text-white">
                        {order.orderDate}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {item.product.salesPrice * item.quantity}
                      </td>
                      <td className="px-6 py-4 text-white whitespace-pre-line">
                        {order.address.address}
                      </td>
                      <td
                        className={`px-6 py-4 ${getStatusColor(
                          item.productStatus
                        )}`}
                      >
                        {item.productStatus}
                      </td>
                      <td className="px-6 py-4">
                        <ChangeStatus
                          updatedState={handleUpdatedStatus}
                          orderId={order.orderId}
                          productId={item.product._id}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderManagement;
