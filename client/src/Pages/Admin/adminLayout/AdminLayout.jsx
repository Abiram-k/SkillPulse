import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Outlet } from "react-router-dom";

// Sample data for the chart
const chartData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  sales: Math.floor(Math.random() * 7000) + 1000,
}));

const recentSales = [
  { id: 1, name: "James B", amount: "₹61,231.00", time: "30 minutes ago" },
  { id: 2, name: "Megan Markle", amount: "₹263,099.00", time: "5 minutes ago" },
  { id: 3, name: "Amy", amount: "₹45,922.00", time: "15 minutes ago" },
  { id: 4, name: "James B", amount: "₹61,231.00", time: "30 minutes ago" },
  { id: 5, name: "Megan Markle", amount: "₹263,099.00", time: "5 minutes ago" },
  // Add more sales data as needed
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-200">
      {/* Hamburger Menu for Small Screens */}
      <button
        className="fixed top-4 left-4 z-20 text-black md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        <div className="p-4 bg-slate-300">
          <h1 className="text-2xl font-bold mb-8">SkillPulse</h1>
          <nav className="lg:space-y-24 flex flex-col ">
            <div className="flex flex-col lg:space-y-3">
              <NavItem
                icon={Menu}
                text="Dashboard"
                active
                redirect="dashboard"
              />
              <NavItem icon={Users} text="Customers" redirect="customers" />
              <NavItem icon={Package} text="Products" redirect="products" />
              <NavItem icon={FileText} text="Orders" redirect="orders" />
              <NavItem icon={Image} text="Banner" redirect="bannerMangement" />
              <NavItem icon={Tag} text="Coupon" redirect="coupons" />
              <NavItem icon={CreditCard} text="Payments" redirect="payments" />
              <NavItem icon={ShoppingBag} text="Category" redirect="category" />
              <NavItem icon={Percent} text="Offers" redirect="offers" />
            </div>
            {/* <div className="absolute bottom-0 w-full p-4 space-y-2 bg-slate-200"> */}
            <div>
              <NavItem icon={Settings} text="Settings" redirect="settings" />
              <NavItem icon={LogOut} text="Logout" redirect="/admin" />
            </div>
            {/* </div> */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-8 transition-all duration-300 ">
        <div className="flex justify-between items-center mb-8 ">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Bell className="h-6 w-6  text-yellow-700" />
            <div className="flex items-center gap-2 ">
              <div className="w-8 h-8 bg-gray-300 text-black rounded-full" />
              <span className="text-black">Abiram</span>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ icon: Icon, text, active, redirect }) {
  return (
    <>
      <Link
        to={redirect}
        className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
          active
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-800 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{text}</span>
      </Link>
    </>
  );
}
