import React, { useEffect, useState } from "react";
import productBanner from "../../../assets/homeProductBanner.webp";
import axios from "axios";
import { Toast } from "../../../Components/Toast";
import { setProductDetails } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../Components/Pagination";
import { Heart } from "lucide-react";
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/products", {
          withCredentials: true,
        });
        console.log("product from homepage:", response.data.products);
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
    dispatch(setProductDetails(product));
    navigate("/user/productDetails");
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentProduct = products.slice(firstPostIndex, lastPostIndex);
  return (
    <div>
      <div
        className="py-8 bg-cover bg-center mb-10 w-full h-96 md:h-[500px] lg:h-[600px] relative"
        style={{
          backgroundImage: `url(${
            "https://digitalalliance.co.id/wp-content/uploads/2021/05/banner-category-gaming-gear-accessories-stands.jpg" ||
            productBanner
          })`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          height: "150px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-sm md:text-2xl font-bold mx-3">
            Unleash Your Inner Gamer with the Gear That Powers Champions—Level
            Up Your Game Today!
          </h1>
        </div>
      </div>

      <div className="filters grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-950 rounded-lg shadow-lg border-b-2 border-t-2 border-gray-800 mb-10">
        <div>
          <p className="font-bold text-2xl mb-4">Category</p>
          <div className="space-y-3">
            <div>
              <input
                type="checkbox"
                id="gaming-consoles"
                className="filter-checkbox mr-2"
              />
              <label
                htmlFor="gaming-consoles"
                className="hover:text-orange-500"
              >
                Gaming Consoles
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="gaming-peripherals"
                className="filter-checkbox mr-2"
              />
              <label
                htmlFor="gaming-peripherals"
                className="hover:text-orange-500"
              >
                Gaming Peripherals
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="graphics-cards"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="graphics-cards" className="hover:text-orange-500">
                Graphics Cards
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="gaming-accessories"
                className="filter-checkbox mr-2"
              />
              <label
                htmlFor="gaming-accessories"
                className="hover:text-orange-500"
              >
                Gaming Accessories
              </label>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-2xl mb-4">Discount Offers</p>
          <div className="space-y-3">
            <div>
              <input
                type="checkbox"
                id="discount-10-20"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="discount-10-20" className="hover:text-orange-500">
                10% - 20%
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="discount-20-30"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="discount-20-30" className="hover:text-orange-500">
                20% - 30%
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="discount-upto-50"
                className="filter-checkbox mr-2"
              />
              <label
                htmlFor="discount-upto-50"
                className="hover:text-orange-500"
              >
                Upto 50%
              </label>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-2xl mb-4">Price Filter</p>
          <div className="space-y-3">
            <div>
              <input
                type="checkbox"
                id="below-5000"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="below-5000" className="hover:text-orange-500">
                Below 5000₹
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="5000-10000"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="5000-10000" className="hover:text-orange-500">
                5000₹ - 10,000₹
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="10000-50000"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="10000-50000" className="hover:text-orange-500">
                10,000₹ - 50,000₹
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="above-50000"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="above-50000" className="hover:text-orange-500">
                Above 50,000₹
              </label>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-2xl mb-4">Brand</p>
          <div className="space-y-3">
            <div>
              <input
                type="checkbox"
                id="brand-boat"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="brand-boat" className="hover:text-orange-500">
                Boat
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="brand-sony"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="brand-sony" className="hover:text-orange-500">
                Sony
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="brand-jbl"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="brand-jbl" className="hover:text-orange-500">
                Jbl
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="brand-bose"
                className="filter-checkbox mr-2"
              />
              <label htmlFor="brand-bose" className="hover:text-orange-500">
                Bose
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {currentProduct.length > 0 ? (
          currentProduct.map((product, index) =>
            product.isListed && !product.isDeleted ? (
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
                <Heart className="absolute top-2 right-3 w-6 h-6" />

                <div className="mt-2 text-center">
                  {/* <h3 className="text-sm font-semibold text-white">
                    {product.brand}
                  </h3> */}
                  <p className="text-xs text-gray-300">{product.productName}</p>
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
            ) : (
              <div
                key={""}
                className="product-card p-4 rounded-lg shadow-lg relative"
              >
                <i className="fas fa-heart absolute top-2 right-2 text-gray-400"></i>
                <img
                  src="https://placehold.co/200x200"
                  alt="Product Image"
                  className="w-full h-40 object-cover mb-4"
                />
                <Heart className="absolute top-2 right-3 w-6 h-6" />

                <div className="text-lg font-bold">Product Name</div>
                <div className="text-sm text-gray-400">Product Description</div>
                <div className="text-xl font-bold mt-2">
                  ₹11,295
                  <span className="line-through text-gray-400">
                    ₹13,999
                  </span>{" "}
                  20% off
                </div>
                <div className="text-sm text-gray-400">Free Delivery</div>
              </div>
            )
          )
        ) : (
          <div
            key={""}
            className="product-card p-4 rounded-lg shadow-lg relative"
          >
            <i className="fas fa-heart absolute top-2 right-2 text-gray-400"></i>
            <img
              src="https://placehold.co/200x200"
              alt="Product Image"
              className="w-full h-40 object-cover mb-4"
            />
            <Heart className="absolute top-2 right-3 w-6 h-6" />

            <div className="text-lg font-bold">Product Name</div>
            <div className="text-sm text-gray-400">Product Description</div>
            <div className="text-xl font-bold mt-2">
              ₹11,295
              <span className="line-through text-gray-400">₹13,999</span> 20%
              off
            </div>
            <div className="text-sm text-gray-400">Free Delivery</div>
          </div>
        )}
      </div>
      <Pagination
        totalPosts={products.length}
        postsPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Shop;
