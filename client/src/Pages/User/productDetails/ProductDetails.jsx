import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState(null);
  const [magnifierVisible, setMagnifierVisible] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const product = useSelector((state) => state.users.details);
  console.log(product[0]._id, "product id");

  const reviews = [
    {
      id: 1,
      name: "Anonymous",
      rating: 5,
      comment: "Good Product",
      description: "Professional build quality, nice...",
    },
    {
      id: 2,
      name: "Rahul",
      rating: 4,
      comment: "Nice Quality, Worth for money",
      description: "Good material",
    },
    {
      id: 3,
      name: "Rizwana",
      rating: 5,
      comment: "Nice Quality, Worth for money",
      description: "Good Sound Quality...",
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getSimilarProduct/${product[0]._id}`
        );
        setSimilarProducts(response.data.similarProducts);
      } catch (error) {
        setError("Failed to load similar products. Please try again later.");
        if (error.response.status === 404)
          setError(error?.response?.data?.message);

        console.error(error);
      }
    })();
  }, [product]);

  const handleMouseEnter = () => setMagnifierVisible(true);
  const handleMouseLeave = () => setMagnifierVisible(false);
  const handleMouseMove = (e) => {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMagnifierPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        {/* {error && <div className="text-red-500">{error}</div>} */}
        {product.length === 0 ? (
          <div>Loading...</div>
        ) : (
          product.map((product, index) => (
            <div
              key={index}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-4"
            >
              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <img
                      src={
                        product.productImage[selectedImage] ||
                        product.productImage[0] ||
                        ""
                      }
                      alt="Product"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {magnifierVisible && (
                      <div
                        className="absolute border-2 border-white rounded-full pointer-events-none"
                        style={{
                          left: `${magnifierPosition.x}px`,
                          top: `${magnifierPosition.y}px`,
                          width: "300px", // Increased size of zoomed preview
                          height: "300px",
                          backgroundImage: `url(${
                            product.productImage[selectedImage] ||
                            product.productImage[0]
                          })`,
                          backgroundPosition: `-${
                            magnifierPosition.x * 1.2
                          }px -${magnifierPosition.y * 1.2}px`,
                          backgroundSize: "400%", // Increased background size for better zoom effect
                        }}
                      />
                    )}
                  </div>
                  <div className="flex space-x-4 overflow-x-auto">
                    {product.productImage.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-20 h-20 rounded cursor-pointer ${
                          selectedImage === idx
                            ? "border-2 border-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm text-gray-400">{product.brand}</h2>
                  <h1 className="text-xl font-bold">{product.productName}</h1>
                </div>
                <div className="flex items-baseline space-x-4">
                  <span className="text-2xl font-bold text-green-500">
                    ₹{product.salesPrice}
                  </span>
                  <span className="text-gray-400 line-through">
                    ₹{product.regularPrice}
                  </span>
                  <span className="text-green-500 text-sm">
                    {product.discount || 99}% off
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill={star <= product.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 text-sm w-full md:w-auto">
                    Add To Cart
                  </button>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 text-sm w-full md:w-auto">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProducts
              .filter((product) => product._id !== productData[0]?._id)
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-900 rounded-lg p-4 relative"
                >
                  <Heart className="absolute top-4 right-4 w-6 h-6" />
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-400">{product.brand}</h3>
                    <p className="font-semibold">{product.productName}</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="font-bold">{product.salesPrice}</span>
                      <span className="text-sm text-gray-400 line-through">
                        {product.regularPrice}
                      </span>
                      <span className="text-green-500 text-sm">
                        {product.offer || "99% off"}
                      </span>
                    </div>
                    {product.salesPrice > 1000 && (
                      <p className="text-sm text-gray-400">Free Delivery</p>
                    )}
                  </div>
                </div>
              ))}
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-900 rounded-lg">
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill={star <= review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="mt-2">{review.comment}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {review.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
