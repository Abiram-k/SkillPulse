import React from "react";
import { Link } from "react-router-dom";

const ManageAddress = () => {
  return (
    <div className="font-mono flex justify-center items-center min-h-screen bg-gray-900 mx-auto">
      <main className="p-6 sm:p-8 md:p-12 max-w-lg w-full mx-auto bg-gray-900 shadow-md rounded-lg">
        <h1 className="text-center text-2xl md:text-3xl font-semibold mb-4">
          Manage Addresses
        </h1>
        <p className="text-center mb-6 text-sm sm:text-base text-gray-600">
          Here you can manage your addresses. You can add, edit, or delete the addresses.
        </p>
        <div className="flex justify-center mb-6">
          <Link to="/user/profile/addNew" className="bg-blue-600 text-white py-2 px-4 rounded flex items-center hover:bg-blue-500 transition duration-200">
            <i className="fas fa-plus mr-2"></i> Add New Address
          </Link>
        </div>
        <div className="space-y-4">
          {["Default", "Home"].map((label, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-white text-gray-900 py-1 px-2 rounded-full text-xs sm:text-sm">
                  {label}
                </span>
                <div className="space-x-4">
                  <Link to={"/user/profile/editAddress"} className="text-gray-400 hover:text-white transition duration-200">
                    Edit
                  </Link>
                  <button className="text-gray-400 hover:text-white transition duration-200">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm leading-6 text-gray-300">
                Brototype, Kochi House,
                <br />
                Ernakulam, Kerala
                <br />
                688 526
                <br />
                Mobile: +91 95421 18371
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageAddress;
