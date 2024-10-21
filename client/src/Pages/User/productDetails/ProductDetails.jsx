import React, { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import { context } from "../../../Components/Provider";
import { useContext,useEffect} from "react";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState([]);
  // const {data} = useContext(context)
  const product = useSelector((state) => state.user.details);

  useEffect(() => {
    setProductData(product);
  }, [product]);
  console.log(product);


  console.log(productData);
  const productImages = [
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
  ];

  const similarProducts = [
    {
      id: 1,
      name: "SOUNDCORE BY ANKERS",
      brand: "BOAT",
      price: "₹11,295",
      originalPrice: "₹13,999",
      discount: "20% off",
      image: "/api/placeholder/300/300",
      freeDelivery: true,
    },
    {
      id: 2,
      name: "BOAT NEWLY LAUNCHED",
      brand: "BOAT",
      price: "₹3999",
      originalPrice: "₹8999",
      discount: "75% off",
      image: "/api/placeholder/300/300",
      freeDelivery: true,
    },
    {
      id: 3,
      name: "SOUNDCORE BY ANKERLIFE",
      brand: "BOAT",
      price: "₹3,199",
      originalPrice: "₹4,999",
      discount: "90% off",
      image: "/api/placeholder/300/300",
      freeDelivery: true,
    },
  ];

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

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        {productData.map((product, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative">
                <img src={product.productImage[0]} alt="Product" className="w-full rounded-lg" />

                <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 rounded">
                  {product.units} Stock remaining
                </div>
              </div>
              <div className="flex space-x-4">
                {product.productImage.map((img, idx) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 rounded cursor-pointer ${
                      selectedImage === idx ? "border-2 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm text-gray-400">{product.brand}</h2>{" "}
                <h1 className="text-xl font-bold">
                  {product.productName}
                </h1>{" "}
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-2xl font-bold">
                  ₹{product.salesPrice}
                </span>{" "}
                <span className="text-gray-400 line-through">
                  ₹{product.regularPrice}
                </span>{" "}
                <span className="text-green-500">
                  {product.discount || "99"}% off
                </span>{" "}
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
                <button className="bg-red-600 text-white px-8 py-2 rounded-full hover:bg-red-700">
                  Add To Cart
                </button>
                <button className="bg-red-600 text-white px-8 py-2 rounded-full hover:bg-red-700">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Similar Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 rounded-lg p-4 relative"
              >
                <Heart className="absolute top-4 right-4 w-6 h-6" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <div className="space-y-2">
                  <h3 className="text-sm text-gray-400">{product.brand}</h3>
                  <p className="font-semibold">{product.name}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-bold">{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                    <span className="text-green-500 text-sm">
                      {product.discount}
                    </span>
                  </div>
                  {product.freeDelivery && (
                    <p className="text-sm text-gray-400">Free Delivery</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill={star <= review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-gray-400 text-sm">{review.description}</p>
                <div className="flex space-x-4 mt-2">
                  <button className="text-gray-400 hover:text-white">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CUSTOMER SERVICE</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Delivery
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">INFORMATION</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Payments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Size guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                <Instagram className="w-6 h-6" />
                <Facebook className="w-6 h-6" />
                <Linkedin className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">CONTACT US</h3>
              <ul className="space-y-2 text-gray-400">
                <li>(+91) 9847658214</li>
                <li>info@skillpulse.com</li>
                <li>9am - 6pm (IST) M-Sat</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
