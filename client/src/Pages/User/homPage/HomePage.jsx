import React, { useEffect, useState, useContext } from "react";
import banner from "../../../assets/homePageBanner.jpg";
import productBanner from "../../../assets/homeProductBanner.webp";
import { useNavigate } from "react-router-dom";
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
          <button className="mt-4 px-4 py-2 md:px-6 md:py-2 bg-red-600 text-white font-bold rounded">
            ORDER NOW
          </button>
        </div>
      </section>

        <h5 className=" text-center mt-5">Categories</h5>
      <section className="flex flex-wrap justify-around py-8 bg-black border-gray-500 border-b-1">
        {category.length > 0 ? (
          category.slice(0, 4).map((cat) => (
            <div

              className="w-full sm:w-1/2 md:w-1/4 text-center mb-4 border-r-2 border-gray-400"
              key={cat._id}
            >
              <img
                src={ cat.image ||"https://placehold.co/150x150" }
                // alt={product.category.description}
                className="mx-auto rounded w-1/2 mb-2"
              />
              <p className="text-white">{cat.name}</p>
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
        {products.length > 0 && products.isListed ? (
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
    </div>
  );
};

export default HomePage;
