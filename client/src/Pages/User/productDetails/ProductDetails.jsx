// import React, { useState } from "react";
// import {
//   ShoppingCart,
//   Heart,
//   Search,
//   User,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Truck,
//   Shield,
//   Clock,
// } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/card";

// const ProductDetails = () => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [stock] = useState(13);

//   const productImages = [
//     "/api/placeholder/400/400",
//     "/api/placeholder/400/400",
//     "/api/placeholder/400/400",
//     "/api/placeholder/400/400",
//   ];

//   const similarProducts = [
//     {
//       name: "Gaming Headset Pro",
//       price: 11295,
//       originalPrice: 13999,
//       discount: "20% off",
//       image: "/api/placeholder/300/300",
//     },
//     {
//       name: "Gaming Mouse X1",
//       price: 3999,
//       originalPrice: 8999,
//       discount: "75% off",
//       image: "/api/placeholder/300/300",
//     },
//     {
//       name: "Graphics Card Ultra",
//       price: 3199,
//       originalPrice: 4999,
//       discount: "90% off",
//       image: "/api/placeholder/300/300",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <header className="container mx-auto p-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">SKILL PULSE</h1>
//         <nav className="hidden md:flex space-x-8">
//           <a href="#" className="hover:text-gray-300">
//             HOME
//           </a>
//           <a href="#" className="hover:text-gray-300">
//             SHOP
//           </a>
//           <a href="#" className="hover:text-gray-300">
//             CATEGORY
//           </a>
//           <a href="#" className="hover:text-gray-300">
//             CONTACT
//           </a>
//           <a href="#" className="hover:text-gray-300">
//             ABOUT US
//           </a>
//         </nav>
//         <div className="flex items-center space-x-4">
//           <Search className="w-6 h-6" />
//           <Heart className="w-6 h-6" />
//           <ShoppingCart className="w-6 h-6" />
//           <User className="w-6 h-6" />
//         </div>
//       </header>

//       {/* Main Product Section */}
//       <main className="container mx-auto p-4 mt-8">
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Product Images */}
//           <div className="relative">
//             <img
//               src={productImages[selectedImage]}
//               alt="Product"
//               className="w-full rounded-lg"
//             />
//             <div className="flex mt-4 space-x-2">
//               {productImages.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Thumbnail ${index + 1}`}
//                   className={`w-20 h-20 rounded cursor-pointer ${
//                     selectedImage === index ? "border-2 border-blue-500" : ""
//                   }`}
//                   onClick={() => setSelectedImage(index)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div>
//             <div className="mb-4">
//               <h2 className="text-sm text-gray-400">BOAT</h2>
//               <h1 className="text-2xl font-bold mb-2">
//                 boAt Nirvana 751 ANC Hybrid Active Noise Cancelling Bluetooth
//                 Wireless Over Ear Headphones
//               </h1>
//               <div className="flex items-center mb-4">
//                 {[...Array(4)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="w-5 h-5 fill-current text-yellow-500"
//                   />
//                 ))}
//                 <Star className="w-5 h-5 fill-current text-yellow-500 opacity-50" />
//               </div>
//             </div>

//             <div className="mb-6">
//               <p className="text-3xl font-bold">₹11,999</p>
//               <p className="text-gray-400 line-through">₹14,999</p>
//               <span className="text-green-500">30% off</span>
//               <p className="text-sm mt-2">{stock} Stock remaining</p>
//             </div>

//             <div className="flex space-x-4">
//               <button className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700">
//                 Add To Cart
//               </button>
//               <button className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Similar Products */}
//         <section className="mt-16">
//           <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {similarProducts.map((product, index) => (
//               <Card key={index} className="bg-gray-800 relative">
//                 <CardContent className="p-4">
//                   <Heart className="absolute top-4 right-4 w-6 h-6" />
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                   <div className="mt-4">
//                     <h3 className="font-bold">{product.name}</h3>
//                     <div className="flex items-center justify-between mt-2">
//                       <div>
//                         <p className="text-xl font-bold">₹{product.price}</p>
//                         <p className="text-sm text-gray-400 line-through">
//                           ₹{product.originalPrice}
//                         </p>
//                       </div>
//                       <span className="text-green-500">{product.discount}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Features */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16">
//           <div className="flex items-center space-x-4">
//             <Clock className="w-8 h-8" />
//             <div>
//               <h3 className="font-bold">EXPRESS SHIPPING</h3>
//               <p className="text-sm text-gray-400">Shipping in 24 Hours</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Truck className="w-8 h-8" />
//             <div>
//               <h3 className="font-bold">SHIPPING TRACKING</h3>
//               <p className="text-sm text-gray-400">
//                 Online order tracking available
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Shield className="w-8 h-8" />
//             <div>
//               <h3 className="font-bold">BUY SAFELY</h3>
//               <p className="text-sm text-gray-400">
//                 Buy safely, any questions? we're here to help!
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProductDetails;
