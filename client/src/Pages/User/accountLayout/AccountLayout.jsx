import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { User, Package, MapPin, Wallet, LogOut } from "lucide-react";
import { logoutUser } from "../../../redux/userSlice";

function AccountLayout() {
  const [profileImage, setProfileImage] = useState(null);
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${user._id}`,
          {
            withCredentials: true,
          }
        );
        setProfileImage(response.data.userData.profileImage);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    })();
  }, []);
  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-4 flex gap-6">
        <div className="w-64">
          <div className="bg-black rounded-lg p-4 mb-4 mt-5">
            <div className="flex items-center gap-3 mb-6">
              <label
                htmlFor="fileInput"
                className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden cursor-pointer bg-yellow-400"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-800" />
                )}
              </label>
             
              <span className="font-semibold">
                {user.firstName || "Abiram k"}
              </span>
            </div>

            <nav className="space-y-2">
              <Link to={""} className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <User className="w-5 h-5" />
                Account Overview
              </Link>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <Package className="w-5 h-5" />
                My Orders
              </button>
              <Link to={"manageAddress"} className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                <MapPin className="w-5 h-5" />
                Manage Addresses
              </Link>
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
        <Outlet />
      </div>
    </div>
  );
}

export default AccountLayout;
