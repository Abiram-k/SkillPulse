import React, { useState, useEffect } from "react";
import banner from "../../../assets/homePageBanner.jpg";
import productBanner from "../../../assets/homeProductBanner.webp";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "../../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToDetails = (product) => {
    dispatch(setProductDetails(product));
    navigate("/user/productDetails");
  };
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        console.log(response.data);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-[#1C1C1C]">
        <div className="text-2xl lg:text-3xl font-bold">SKILL PULSE</div>

        <button
          id="menu-btn"
          className="block lg:hidden text-white focus:outline-none"
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

        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col lg:flex-row lg:flex lg:space-x-4 lg:items-center absolute lg:static bg-black lg:bg-transparent top-16 left-0 w-full lg:w-auto z-10 text-center space-y-8 lg:space-y-0 pb-8 lg:p-0`}
        >
          <a href="#" className="hover:text-gray-400">
            HOME
          </a>
          <a href="#" className="hover:text-gray-400">
            SHOP
          </a>
          <a href="#" className="hover:text-gray-400">
            CATEGORY
          </a>
          <a href="#" className="hover:text-gray-400">
            CONTACT
          </a>
          <a href="#" className="hover:text-gray-400">
            ABOUT US
          </a>
          <div className="lg:flex space-x-1 align-middle justify-center hidden relative font-sans">
            <i className="fas fa-search absolute right-3 top-3.5 text-gray-200"></i>
            <input
              type="text"
              className="bg-transparent border-2 rounded border-gray-700 text-white p-2  focus:outline-none"
              placeholder="Search for products"
            />
          </div>
          <div className="flex flex-col  lg:flex-row space-x-4 text-center space-y-8 lg:space-y-0 border-t-2 border-gray-500 lg:border-none p-1 lg:p-0">
            <a href="#"></a>
            <Link
              to="/signup"
              className="hover:text-red-800 bg-gray-800 p-2 rounded text-red-900 lg:font-bold lg:border border-red-700"
            >
              SIGNUP
            </Link>
            <Link
              to="/login"
              className="hover:text-red-800 bg-gray-800 p-2 rounded text-red-900 lg:font-bold lg:border border-red-700"
            >
              LOGIN
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative ">
        <img
          src={banner}
          alt="Gaming setup with colorful lights"
          className="w-full h-auto"
        />
        <div className="absolute top-1/4 right-8 transform -translate-y-1/4 px-4 text-left md:text-right lg:right-16 lg:top-80">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            EXHALE WORRIES WITH GAMING
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-2 ">
            Deserve best interpret your music differently
          </p>
          <button className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded text-center font-mono ">
            ORDER NOW
          </button>
        </div>
      </section>

      <section className="flex flex-wrap justify-around py-8 bg-black border-gray-500 border-b-2 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="w-full sm:w-1/2 md:w-1/4 text-center mb-4"
              key={product._id}
            >
              <img
                src="https://placehold.co/150x150"
                alt={product.category.description}
                className="mx-auto"
              />
              <p className="text-white">{product.category.name}</p>
            </div>
          ))
        ) : (
          <>
            <div className="w-full sm:w-1/2 md:w-1/4 text-center mb-4">
              <img
                src="https://placehold.co/150x150"
                alt="RazorClaw X"
                className="mx-auto"
              />
              <p className="text-white">RazorClaw X</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 text-center mb-4">
              <img
                src="https://placehold.co/150x150"
                alt="HyperVox Graphics card"
                className="mx-auto"
              />
              <p className="text-white">HyperVox Graphics card</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 text-center mb-4">
              <img
                src="https://placehold.co/150x150"
                alt="Vortex Controller"
                className="mx-auto"
              />
              <p className="text-white">Vortex Controller</p>
            </div>
          </>
        )}
      </section>

      <section
        className="py-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${productBanner})` }}
      >
        <div className="ps-12 bg-opacity-60 rounded-lg font-mono">
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 bg-black">
        {products.length > 0 ? (
          products.map(
            (product) =>
              product.isListed && (
                <div className="bg-gray-800 p-4 rounded" key={product._id}>
                  <img
                    src={
                      product.productImage[0] || "https://placehold.co/300x200"
                    }
                    alt={product.productDescription}
                    className="w-full h-auto"
                    onClick={() => goToDetails(product)}
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">{product.brand}</h3>
                    <p>{product.productName}</p>
                    <p className="text-lg font-bold">
                      ₹{product.salesPrice}
                      <span className="line-through">
                        ₹{product.regularPrice}
                      </span>
                      20% off
                    </p>
                    <p>{product.salesPrice > 1000 ? "Free Delivery" : ""}</p>
                  </div>
                </div>
              )
          )
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded">
              <img
                src="https://placehold.co/300x200"
                alt="PC Case"
                className="w-full h-auto"
                onClick={() => goToDetails()}
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
                alt="Vortex Controller"
                className="w-full h-auto"
                onClick={() => goToDetails()}
              />
              <div className="mt-4">
                <h3 className="text-xl font-bold">BOAT </h3>
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
                onClick={() => goToDetails()}
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
          </>
        )}
      </section>

      <footer className="bg-black text-gray-400 py-8">
        <div className="flex flex-wrap justify-around gap-6">
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
        <div className="flex flex-wrap justify-around gap-6 mt-8">
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
              <li>Affiliates</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">NEWSLETTER</h3>
            <input
              type="email"
              className="w-full p-2 mt-2 rounded text-black"
              placeholder="Enter your email"
            />
            <button className="w-full mt-2 px-4 py-2 bg-red-600 text-white font-bold rounded">
              Subscribe
            </button>
          </div>
        </div>
        <p className="text-center mt-8">
          © 2023 FutureTech. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
