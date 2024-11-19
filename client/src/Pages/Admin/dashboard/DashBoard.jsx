import React, { useEffect } from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  Users,
  Package,
  FileText,
  Image,
  Tag,
  CreditCard,
  ShoppingBag,
  Percent,
} from "lucide-react";
import axios from "@/axiosIntercepters/AxiosInstance";
import { Link } from "react-router-dom";
import Chart from "./Chart";

// Sample data for the chart
const chartData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  sales: Math.floor(Math.random() * 7000) + 1000,
}));

export default function Dashboard() {
  const [recentSales, setRecentSales] = useState([]);
  const [filter, setFilter] = useState("Monthly");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/admin/recentSales?filter=${filter}`);
        console.log(response.data);
        setRecentSales(response.data.orders);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    })();
  }, [filter]);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Sales"
          value={recentSales.reduce(
            (acc, order) =>
              acc +
              order.orderItems.reduce(
                (itemAcc, item) => itemAcc + parseInt(item.quantity || 0),
                0
              ),
            0
          )}
          bgColor="bg-gray-800"
        />
        {/* <StatsCard title="Visitors" value="2,500" bgColor="bg-green-100" /> */}
        <StatsCard
          title="Total Orders"
          value={recentSales.length}
          bgColor="bg-gray-800"
        />
        <StatsCard
          title="Users"
          value={new Set(recentSales.map((order) => order.user?.email)).size}
          bgColor="bg-gray-800"
        />
      </div>
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full ">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="mb-4 flex space-x-4 font-mono">
            {["Monthly", "Yearly"].map((option) => (
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
          <h2 className="text-gray-400 font-bold text-xl">Total Sales</h2>
          <Chart orders={recentSales} />
        </div>
        {/* <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 font-mono">
            Sales Analytics
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="sales" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        <div className="bg-white p-6 rounded-lg  shadow overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl  text-gray-400 font-bold ">Recent Sales</h2>
          </div>
          <div className="space-y-4 font-sans">
            {recentSales.length > 0 ? (
              recentSales
                ?.reverse()
                .slice(0, 5)
                .map((sale) => (
                  <div
                    key={sale?._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          sale.user.profileImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhCuoop0MD3fNefnFp8SWPdfnsXdOzFBeAQg&s"
                        }
                        alt=""
                        className="w-10 h-10 bg-gray-200 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-black">
                          {sale?.user?.firstName}
                          {""}
                          {sale?.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {sale?.orderDate}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-black">
                      ₹{" "}
                      {sale?.totalDiscount
                        ? sale?.totalDiscount
                        : sale?.totalAmount}
                    </span>
                  </div>
                ))
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">"No Order Yet !</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <Link
            to={"/admin/orderReport"}
            className="bg-gray-300 p-3 rounded font-bold text-orange-600 shadow-lg hover:scale-105 duration-150"
          >
            Download Sales Report
          </Link>
        </div>
      </div>
    </>
  );
}

function StatsCard({ title, value, bgColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <h3 className="text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
