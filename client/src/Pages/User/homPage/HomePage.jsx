import React, { useEffect, useState, useContext } from "react";
import banner from "../../../assets/homePageBanner.jpg";
import productBanner from "../../../assets/homeProductBanner.webp";
import { useNavigate } from "react-router-dom";
import { context } from "../../../Components/Provider";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "../../../redux/userSlice";
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { setData } = useContext(context);
  const dispatch = useDispatch();
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
  const goToDetails = (product) => {
    // setData(product);
    dispatch(setProductDetails(product));
    navigate("/user/productDetails");
  };

  return (
    <div>
      <section className="relative overflow-hidden h-80 lg:h-auto">
        <img
          src={banner}
          alt="Gaming setup with colorful lights"
          className="w-full h-auto"
        />
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center md:text-right max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 md:top-1/3 md:translate-x-0 md:right-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white break-words">
            EXHALE WORRIES WITH GAMING
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-2 text-gray-200 hidden lg:block">
            Deserve best, interpret your music differently
          </p>
          <button className="mt-4 px-4 py-2 md:px-6 md:py-2 bg-red-600 text-white font-bold rounded">
            ORDER NOW
          </button>
        </div>
      </section>

      <section className="flex flex-wrap justify-around py-8 bg-black border-gray-500 border-b-2">
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
        <div className="w-full sm:w-1/2 md:w-1/4 text-center mb-4">
          <img
            src="https://placehold.co/150x150"
            alt="PhantomBass"
            className="mx-auto"
          />
          <p className="text-white">PhantomBass</p>
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

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-8 bg-black">
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
        <div className="flex flex-wrap justify-around gap-8">
          {/* Shipping Section */}
          <div className="text-center flex flex-col items-center w-1/3 md:w-auto">
            <i className="fas fa-shipping-fast text-2xl mb-2"></i>
            <p className="font-semibold">EXPRESS SHIPPING</p>
            <p>Shipping in 24 Hours</p>
          </div>

          {/* Tracking Section */}
          <div className="text-center flex flex-col items-center w-1/3 md:w-auto">
            <i className="fas fa-truck text-2xl mb-2"></i>
            <p className="font-semibold">SHIPPING TRACKING</p>
            <p>Online order tracking available</p>
          </div>

          {/* Buy Safely Section */}
          <div className="text-center flex flex-col items-center w-1/3 md:w-auto">
            <i className="fas fa-shield-alt text-2xl mb-2"></i>
            <p className="font-semibold">BUY SAFELY</p>
            <p>Buy safely, any question is here to help!</p>
          </div>
        </div>

        {/* Customer and Information Sections */}
        <div className="flex flex-wrap justify-around mt-8 gap-8">
          {/* Customer Service */}
          <div className="text-center w-1/2 md:w-auto">
            <h3 className="font-bold">CUSTOMER SERVICE</h3>
            <ul className="mt-2 space-y-2">
              <li>Contact us</li>
              <li>Shipping & Returns</li>
              <li>Terms & Conditions</li>
              <li>Delivery</li>
            </ul>
          </div>

          {/* Information */}
          <div className="text-center w-1/2 md:w-auto">
            <h3 className="font-bold">INFORMATION</h3>
            <ul className="mt-2 space-y-2">
              <li>About</li>
              <li>Payments</li>
              <li>Size guide</li>
              <li>Administrator</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="text-center w-1/2 md:w-auto">
            <h3 className="font-bold">FOLLOW US</h3>
            <div className="flex justify-center space-x-4 mt-2">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-linkedin-in"></i>
            </div>
          </div>

          {/* Contact Us */}
          <div className="text-center w-1/2 md:w-auto">
            <h3 className="font-bold">CONTACT US</h3>
            <ul className="mt-2 space-y-2">
              <li>+91 6282004572</li>
              <li>info@skillpulse.com</li>
              <li>10:00 – 20:00 GMT+1</li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
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
