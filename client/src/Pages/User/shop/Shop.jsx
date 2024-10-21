import React, { useEffect, useState } from "react";
import productBanner from "../../../assets/homeProductBanner.webp";
import axios from "axios";
import { Toast } from "../../../Components/Toast";
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/products", {
          // withCredentials: true,
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
  return (
    <div>
      <div className="carousel relative">
        <img
          src={productBanner || "https://placehold.co/1200x400"}
          alt="Carousel Image"
          className="w-full"
        />
      </div>
      <div className="filters flex justify-around p-4">
        <div>
          <div className="font-bold">Category</div>
          <div>
            <input
              type="checkbox"
              id="gaming-consoles"
              className="filter-checkbox"
            />
            <label htmlFor="gaming-consoles">Gaming Consoles</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="gaming-peripherals"
              className="filter-checkbox"
            />
            <label htmlFor="gaming-peripherals">Gaming Peripherals</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="graphics-cards"
              className="filter-checkbox"
            />
            <label htmlFor="graphics-cards">Graphics Cards</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="gaming-accessories"
              className="filter-checkbox"
            />
            <label htmlFor="gaming-accessories">Gaming Accessories</label>
          </div>
        </div>
        <div>
          <div className="font-bold">Discount offers</div>
          <div>
            <input
              type="checkbox"
              id="discount-10-20"
              className="filter-checkbox"
            />
            <label htmlFor="discount-10-20">10% - 20%</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="discount-20-30"
              className="filter-checkbox"
            />
            <label htmlFor="discount-20-30">20% - 30%</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="discount-upto-50"
              className="filter-checkbox"
            />
            <label htmlFor="discount-upto-50">Upto 50%</label>
          </div>
        </div>
        <div>
          <div className="font-bold">Price Filter</div>
          <div>
            <input
              type="checkbox"
              id="below-5000"
              className="filter-checkbox"
            />
            <label htmlFor="below-5000">Below 5000₹</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="5000-10000"
              className="filter-checkbox"
            />
            <label htmlFor="5000-10000">5000₹ - 10,000₹</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="10000-50000"
              className="filter-checkbox"
            />
            <label htmlFor="10000-50000">10,000₹ - 50,000₹</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="above-50000"
              className="filter-checkbox"
            />
            <label htmlFor="above-50000">Above 50,000₹</label>
          </div>
        </div>
        <div>
          <div className="font-bold">Brand</div>
          <div>
            <input
              type="checkbox"
              id="brand-boat"
              className="filter-checkbox"
            />
            <label htmlFor="brand-boat">Boat</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="brand-sony"
              className="filter-checkbox"
            />
            <label htmlFor="brand-sony">Sony</label>
          </div>
          <div>
            <input type="checkbox" id="brand-jbl" className="filter-checkbox" />
            <label htmlFor="brand-jbl">Jbl</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="brand-bose"
              className="filter-checkbox"
            />
            <label htmlFor="brand-bose">Bose</label>
          </div>
        </div>
      </div>
      <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {products.length > 0 ? (
          products.map((product, index) =>
            product.isListed ? (
              <div
                key={index}
                className="product-card p-4 rounded-lg shadow-lg relative"
              >
                <i className="fas fa-heart absolute top-2 right-2 text-gray-400"></i>
                <img
                  src={
                    product.productImage[0] 
                    ||
                     "https://placehold.co/200x200"
                  }
                  alt="Product Image"
                  className="w-full h-40 object-cover mb-4"
                />
                <div className="text-lg font-bold">{product.productName}</div>
                <div className="text-sm text-gray-400">
                  {product.productDescription}
                </div>
                <div className="text-xl font-bold mt-2">
                  ₹{product.salesPrice}
                  <span className="line-through text-gray-400">
                    ₹{product.regularPrice}
                  </span>{" "}
                  20% off
                </div>
                <div className="text-sm text-gray-400">
                  {product.salesPrice > 1000 ? "Free Delivery" : ""}
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
    </div>
  );
};

export default Shop;
