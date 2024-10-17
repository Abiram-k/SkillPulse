import React, { useState } from "react";
import banner from "../../../assets/homePageBanner.jpg";
import productBanner from "../../../assets/homeProductBanner.webp";
const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div class="bg-[#1C1C1C] text-white p-4 flex justify-between items-center">
        <div class="text-sm w-full lg:w-fit lg:text-2xl font-bold">
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
            class="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            HOME
          </a>
          <a
            href="#"
            class="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            SHOP
          </a>
          <a
            href="#"
            class="text-white no-underline hover:bg-slate-600 rounded p-1 transition duration-200"
          >
            CATEGORY
          </a>
          <a
            href="#"
            class="text-white no-underline hover:bg-slate-600 rounded p-1"
          >
            CONTACT
          </a>
          <a
            href="#"
            class="text-white no-underline hover:bg-slate-600 rounded p-1"
          >
            ABOUT US
          </a>
        </div>

        <div class="flex gap-4 text-lg justify-center lg:justify-end w-full lg:w-auto">
          <i className="fas fa-search lg:text-xl"></i>
          <i className="fas fa-heart text-red-500 lg:text-xl"></i>
          <i className="fas fa-shopping-cart lg:text-xl"></i>
          <i className="fas fa-user-circle lg:text-xl"></i>
        </div>
      </div>

      <section className="relative ">
        <img
          src={banner}
          alt="Gaming setup with colorful lights"
          className="w-full h-auto"
        />
        <div className="absolute top-1/4 left-2/4 text-end me-10">
          <h1 className="text-5xl font-bold">EXHALE WORRIES WITH GAMING</h1>
          <p className="text-xl mt-2">
            Deserve best interpret your music differently
          </p>
          <button className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded">
            ORDER NOW
          </button>
        </div>
      </section>
      <section className="flex justify-around py-8 bg-black border-gray-500 border-b-2">
        <div className="text-center">
          <img
            src="https://placehold.co/150x150"
            alt="RazorClaw X"
            className="mx-auto"
          />
          <p>RazorClaw X</p>
        </div>
        <div className="text-center">
          <img
            src="https://placehold.co/150x150"
            alt="HyperVox Graphics card"
            className="mx-auto"
          />
          <p>HyperVox Graphics card</p>
        </div>
        <div className="text-center">
          <img
            src="https://placehold.co/150x150"
            alt="Vortex Controller"
            className="mx-auto"
          />
          <p>Vortex Controller</p>
        </div>
        <div className="text-center">
          <img
            src="https://placehold.co/150x150"
            alt="PhantomBass"
            className="mx-auto"
          />
          <p>PhantomBass</p>
        </div>
      </section>
      <section
        className="py-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${productBanner})` }}
      >
        <div className="ps-12 bg-opacity-60  rounded-lg font-mono">
          <h2 className="text-3xl font-bold text-white">
            FireStrike Joystick – Unleash Precision Control
          </h2>
          <p className="mt-4 text-gray-300 font-semibold">
            The FireStrike Joystick is engineered for gamers who crave
            <br />
            precision, control, and immersive gameplay.
          </p>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>Solo Pro wireless joystick</li>
            <li>Carrying Case</li>
            <li>Lightning to USB-A charging cable</li>
            <li>Quick Start Guide</li>
            <li>Warranty Cart</li>
          </ul>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-4 p-8 bg-black">
        <div className="bg-gray-800 p-4 rounded">
          <img src="" alt="Vortex Controller" className="w-full h-auto" />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>Soundcore by Ankers</p>
            <p className="text-lg font-bold">
              ₹11,295 <span className="line-through">₹13,999</span> 20% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <img
            src="https://placehold.co/300x200"
            alt="Keyboard"
            className="w-full h-auto"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>BOAT Newly Launched</p>
            <p className="text-lg font-bold">
              ₹3999 <span className="line-through">₹8999</span> 75% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <img
            src="https://placehold.co/300x200"
            alt="PC Case"
            className="w-full h-auto"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>Soundcore by Ankerlife</p>
            <p className="text-lg font-bold">
              ₹3,199 <span className="line-through">₹4,999</span> 90% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <img
            src="https://placehold.co/300x200"
            alt="Headphones"
            className="w-full h-auto"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>Soundcore by Ankers</p>
            <p className="text-lg font-bold">
              ₹11,295 <span className="line-through">₹13,999</span> 20% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <img
            src="https://placehold.co/300x200"
            alt="Gaming Mouse"
            className="w-full h-auto"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>BOAT Newly Launched</p>
            <p className="text-lg font-bold">
              ₹3999 <span className="line-through">₹8999</span> 75% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <img
            src="https://placehold.co/300x200"
            alt="Graphics Card"
            className="w-full h-auto"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">BOAT</h3>
            <p>Soundcore by Ankerlife</p>
            <p className="text-lg font-bold">
              ₹3,199 <span className="line-through">₹4,999</span> 90% off
            </p>
            <p>Free Delivery</p>
          </div>
        </div>
      </section>
      <footer className="bg-black text-gray-400 py-8">
        <div className="flex justify-around">
          <div className="text-center">
            <i className="fas fa-shipping-fast text-2xl"></i>
            <p>EXPRESS SHIPPING</p>
            <p>Shipping in 24 Hours</p>
          </div>
          <div className="text-center">
            <i className="fas fa-truck text-2xl"></i>
            <p>SHIPPING TRACKING</p>
            <p>Online order tracking available</p>
          </div>
          <div className="text-center">
            <i className="fas fa-shield-alt text-2xl"></i>
            <p>BUY SAFELY</p>
            <p>Buy safely, any question is here to help!</p>
          </div>
        </div>
        <div className="flex justify-around mt-8">
          <div>
            <h3 className="font-bold">CUSTOMER SERVICE</h3>
            <ul className="mt-2 space-y-2">
              <li>Contact us</li>
              <li>Shipping & Returns</li>
              <li>Terms & Conditions</li>
              <li>Delivery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">INFORMATION</h3>
            <ul className="mt-2 space-y-2">
              <li>About</li>
              <li>Payments</li>
              <li>Size guide</li>
              <li>Administrator</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">FOLLOW US</h3>
            <div className="flex space-x-4 mt-2 ">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-linkedin-in"></i>
            </div>
          </div>
          <div>
            <h3 className="font-bold">CONTACT US</h3>
            <ul className="mt-2 space-y-2">
              <li>+91 6282004572</li>
              <li>info@skillpulse.com</li>
              <li>10:00 – 20:00 GMT+1</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <img
            src="https://placehold.co/100x50"
            alt="Payment methods"
            className="mx-auto"
          />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
