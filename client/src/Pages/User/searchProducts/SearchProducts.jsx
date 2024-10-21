import axios from "axios";
import React, { useEffect } from "react";
import { Toast } from "../../../Components/Toast";

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
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
  return (
    <div>
      <div className="carousel">
        <img src="https://placehold.co/1200x300" alt="Carousel Image" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search hear ..." />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="product-grid">
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERS</p>
          <p className="price">
            ₹11,295 <span className="old-price">₹13,999</span>{" "}
            <span className="discount">20% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>BOAT NEWLY LAUNCHED</p>
          <p className="price">
            ₹3999 <span className="old-price">₹8999</span>{" "}
            <span className="discount">75% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERLIFE</p>
          <p className="price">
            ₹3,199 <span className="old-price">₹4,999</span>{" "}
            <span className="discount">90% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERS</p>
          <p className="price">
            ₹11,295 <span className="old-price">₹13,999</span>{" "}
            <span className="discount">20% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>BOAT NEWLY LAUNCHED</p>
          <p className="price">
            ₹3999 <span className="old-price">₹8999</span>{" "}
            <span className="discount">75% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERLIFE</p>
          <p className="price">
            ₹3,199 <span className="old-price">₹4,999</span>{" "}
            <span className="discount">90% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERS</p>
          <p className="price">
            ₹11,295 <span className="old-price">₹13,999</span>{" "}
            <span className="discount">20% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>BOAT NEWLY LAUNCHED</p>
          <p className="price">
            ₹3999 <span className="old-price">₹8999</span>{" "}
            <span className="discount">75% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
        <div className="product-card">
          <img src="https://placehold.co/200x200" alt="Product Image" />
          <h2>BOAT</h2>
          <p>SOUNDCORE BY ANKERLIFE</p>
          <p className="price">
            ₹3,199 <span className="old-price">₹4,999</span>{" "}
            <span className="discount">90% off</span>
          </p>
          <p>Free Delivery</p>
        </div>
      </div>
      <footer className="footer">
        <div className="section">
          <h3>EXPRESS SHIPPING</h3>
          <p>Shipping in 24 Hours</p>
        </div>
        <div className="section">
          <h3>SHIPPING TRACKING</h3>
          <p>Online order tracking available</p>
        </div>
        <div className="section">
          <h3>BUY SAFELY</h3>
          <p>Buy safely, any question is here to help!</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchProducts;
