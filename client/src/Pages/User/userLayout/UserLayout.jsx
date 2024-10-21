import React, { useState } from "react";
import { Outlet } from "react-router-dom";

function UserLayout() {
    const [menuOpen,setMenuOpen] = useState(false)
  return (
    <>
      <div className="bg-[#1C1C1C] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-sm w-full lg:w-fit lg:text-2xl font-bold">
          SKILL PULSE
        </div>

        <button
          id="menu-btn"
          className="absolute right-4 block lg:hidden text-white text-end focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col lg:flex-row lg:flex lg:space-x-4 lg:items-center absolute lg:static bg-black lg:bg-transparent top-16 left-0 w-full lg:w-auto z-10 text-center space-y-8 lg:space-y-0 pb-8 lg:p-0`}
        >
          <a
            href="#"
            className="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            SHOP
          </a>
          <a
            href="#"
            className="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            CATEGORY
          </a>
          <a
            href="#"
            className="text-white no-underline hover:bg-slate-600 rounded p-1"
          >
            CONTACT
          </a>
          <a
            href="#"
            className="text-white no-underline hover:bg-slate-600 rounded p-1"
          >
            ABOUT US
          </a>
        </div>

        <div className="flex gap-4 text-lg justify-center lg:justify-end w-full lg:w-auto">
          <i className="fas fa-search lg:text-xl"></i>
          <i className="fas fa-heart text-red-500 lg:text-xl"></i>
          <i className="fas fa-shopping-cart lg:text-xl"></i>
          <i className="fas fa-user-circle lg:text-xl"></i>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default UserLayout;
