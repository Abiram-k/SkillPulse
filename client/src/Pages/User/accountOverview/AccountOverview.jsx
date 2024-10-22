import React from "react";
import { User, Package, MapPin, Wallet, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/userSlice";
const AccountOverview = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const user = useSelector((state) => state.users.user);
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 flex gap-6">
        <div className="w-64">
          <div className="bg-black rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-800" />
              </div>
              <span className="font-semibold">
                {user.firstName  || "Abiram k"}
              </span>
            </div>

            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-red-100/10 rounded-lg text-left">
                <User className="w-5 h-5" />
                Account Overview
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <Package className="w-5 h-5" />
                My Orders
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <MapPin className="w-5 h-5" />
                Manage Addresses
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <Wallet className="w-5 h-5" />
                Wallet
              </button>
            </nav>

            <button
              className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              LOGOUT
            </button>
          </div>
        </div>

        <div className="flex-1 bg-black rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-800" />
            </div>
            {/* <button className="px-4 py-2 border border-gray-600 rounded-lg">
              Edit
            </button> */}
          </div>

          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

          <form className="space-y-6 font-mono">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue={user.firstName || Abiram}
                  className="w-full bg-gray-700 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue={user.secondName || "K"}
                  className="w-full bg-gray-700 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Date of Birth</label>
              <input
                type="date"
                defaultValue="2001-09-21"
                className="w-full bg-gray-700 rounded-lg p-2"
              />
            </div>

            <h3 className="text-lg font-semibold pt-4">Contact Information</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Mobile Number</label>
                <input
                  type="tel"
                  defaultValue={user.mobileNumber || "992010921"}
                  className="w-full bg-gray-700 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email || "user@gmail.com"}
                  className="w-full bg-gray-700 rounded-lg p-2"
                />
              </div>
            </div>

            <button className="bg-green-600 text-white px-6 py-2 rounded-lg ">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
