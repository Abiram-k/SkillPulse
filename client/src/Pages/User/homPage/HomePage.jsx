import React, { useEffect, useState, useContext } from "react";
import banner from "../../../assets/homePageBanner.jpg";
import productBanner from "../../../assets/homeProductBanner.webp";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { context } from "../../../Components/Provider";
import { Toast } from "../../../Components/Toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "../../../redux/userSlice";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(
    "home page user",
    useSelector((state) => state.users.user)
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/products", {
          withCredentials: true,
        });
        console.log("product from homepage:", products);
        setProducts(response.data.products);
        setCategory(response.data.category);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `${error?.response?.data.message}`,
        });
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
          <Link
            to="/user/shop"
            className="mt-4 px-4 py-2 md:px-6 md:py-2 bg-red-600 text-white font-bold rounded inline-block text-center hover:bg-red-700"
          >
            ORDER NOW
          </Link>
        </div>
      </section>

      <h5 className=" text-center mt-5 text-xl">Categories</h5>
      <section className="flex flex-wrap justify-around gap-6 py-8 bg-black border-gray-500 border-b">
        {category.length > 0 ? (
          category.slice(0, 4).map((cat) => (
            <div
              className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 text-center mb-8 p-4 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              key={cat._id}
            >
              <img
                src={cat.image || "https://placehold.co/150x150"}
                className="mx-auto rounded-full w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover mb-4 hover:scale-105 transition-transform duration-300"
                alt={cat.name}
              />
              <p className="text-white text-sm md:text-base font-semibold">
                {cat.name}
              </p>
            </div>
          ))
        ) : (
          <>
            {["RazorClaw X", "HyperVox Graphics card", "Vortex Controller"].map(
              (placeholder, index) => (
                <div
                  className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 text-center mb-8 p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  key={index}
                >
                  <img
                    src="https://placehold.co/150x150"
                    alt={placeholder}
                    className="mx-auto rounded-full w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover mb-4 hover:scale-105 transition-transform duration-300"
                  />
                  <p className="text-white text-sm md:text-base font-semibold">
                    {placeholder}
                  </p>
                </div>
              )
            )}
          </>
        )}
      </section>

      <section
        className="py-8 bg-cover bg-center mb-10"
        style={{
          backgroundImage: `url(${
            "https://digitalalliance.co.id/wp-content/uploads/2021/05/banner-category-gaming-gear-accessories-stands.jpg" ||
            productBanner
          })`,
        }}
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

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 bg-black">
        {products.length > 0 ? (
          products.map(
            (product) =>
              product.isListed && (
                <div
                  className="bg-gray-800 p-3 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
                  key={product._id}
                >
                  <img
                    src={
                      product.productImage[0] || "https://placehold.co/300x200"
                    }
                    alt={product.productDescription}
                    className="w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => goToDetails(product)}
                  />
                  <div className="mt-2 text-center">
                    <h3 className="text-sm font-semibold text-white">
                      {product.brand}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {product.productName}
                    </p>
                    <p className="text-sm font-bold text-green-500">
                      ₹{product.salesPrice}
                      <span className="line-through text-gray-400 ml-1">
                        ₹{product.regularPrice}
                      </span>
                      <span className="text-red-500 ml-1">20% off</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {product.salesPrice > 1000
                        ? "Free Delivery"
                        : "Delivery Charges Apply"}
                    </p>
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
    </div>
  );
};

export default HomePage;
