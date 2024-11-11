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

// Sample data for the chart
const chartData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  sales: Math.floor(Math.random() * 7000) + 1000,
}));

// const recentSales = [
//   { id: 1, name: "James B", amount: "₹61,231.00", time: "30 minutes ago" },
//   { id: 2, name: "Megan Markle", amount: "₹263,099.00", time: "5 minutes ago" },
//   { id: 3, name: "Amy", amount: "₹45,922.00", time: "15 minutes ago" },
//   { id: 4, name: "James B", amount: "₹61,231.00", time: "30 minutes ago" },
//   { id: 5, name: "Megan Markle", amount: "₹263,099.00", time: "5 minutes ago" },
//   // Add more sales data as needed
// ];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentSales, setRecentSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/admin/recentSales");
        console.log(response.data);
        setRecentSales(response.data.orders);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    })();
  }, []);
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
          value={
            new Set(recentSales.map((order) => order.user?.email)).size
          }
          bgColor="bg-gray-800"
        />
      </div>
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="sales" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-lg shadow overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Sales</h2>
            {/* <button className="text-blue-600">View all</button> */}
          </div>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales?.map((sale) => (
                <div
                  key={sale?._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 bg-gray-200 rounded-full" /> */}
                    <img
                      src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhCuoop0MD3fNefnFp8SWPdfnsXdOzFBeAQg&s" ||
                        sale.user.profileImage
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
                      <p className="text-sm text-gray-500">{sale?.orderDate}</p>
                    </div>
                  </div>
                  <span className="font-medium text-black">
                    {sale?.totalDiscount}
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
