import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/Majorcomponents/bars/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
// import { getCroppedImg } from "./ImageCropper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProductAdd() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sleeve, setsleeve] = useState("");

  const [product, setProduct] = useState({
    images: Array(4).fill(null),
  });
  const navigate = useNavigate();

  const [stock, setStock] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Track which image is being cropped
  const [image, setImage] = useState(null); // Image for cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // =========================GETTING CATEGORY DATA ===============================

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/admin/getcategory");
        setCategoryDetails(response?.data?.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  // ===================VALIDATE FORM===================================================

  const [errors, setErrors] = useState({});
  const letterRegex = /^[A-Za-z\s]+$/;

  const validateForm = () => {
    const newErrors = {};
    if (!productName.trim()) {
      newErrors.productName = "ProductName is required.";
    } else if (productName.length < 5) {
      newErrors.productName = "ProductName must be at least 5 characters.";
    } else if (!letterRegex.test(productName)) {
      newErrors.productName = "Category can only contain letters.";
    }
    if (!description.trim()) {
      newErrors.description = "description is required.";
    } else if (description.length < 5) {
      newErrors.description = "description must be at least 5 characters.";
    } else if (!letterRegex.test(description)) {
      newErrors.description = "description can only contain letters.";
    }

    if (!additionalInfo.trim()) {
      newErrors.additionalInfo = "additionalInfo is required.";
    } else if (additionalInfo.length < 5) {
      newErrors.additionalInfo =
        "additionalInfo must be at least 5 characters.";
    } else if (!letterRegex.test(additionalInfo)) {
      newErrors.additionalInfo = "additionalInfo can only contain letters.";
    }

    if (regularPrice === "" || isNaN(regularPrice)) {
      newErrors.regularPrice =
        "Regular Price is required and must be a number.";
    } else if (regularPrice < 0) {
      newErrors.regularPrice = "Regular Price cannot be negative.";
    }

    // Sale Price validation (must be a positive number)
    if (salePrice === "" || isNaN(salePrice)) {
      newErrors.salePrice = "Sale Price is required and must be a number.";
    } else if (salePrice < 0) {
      newErrors.salePrice = "Sale Price cannot be negative.";
    }

    const stockErrors = {};
    Object.keys(stock).forEach((size) => {
      if (stock[size] < 0) {
        stockErrors[size] = ` ${size} stock cannot be negative.`;
      }
    });
    if (Object.keys(stockErrors).length > 0) {
      newErrors.stock = stockErrors;
    }

    return newErrors;
  };

  // =========================SENDING IMAGE TO CROPPER ===============================

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      console.log("url of image", image);
      setSelectedImageIndex(index);
    }
  };

  // =========================ONCROP FUNCTION ===============================

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // =========================SAVING IMAGE CROPPING ===============================

  const saveCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      const croppedImageURL = URL.createObjectURL(croppedImageBlob);

      const newImages = [...product.images];
      newImages[selectedImageIndex] = croppedImageBlob;

      setProduct({ ...product, images: newImages });
      setImage(null);
      setSelectedImageIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // =========================CLOUDINARY ADD===============================

  const uploadImagesToCloudinary = async () => {
    const uploadPromises = product.images.map(async (file) => {
      if (!file) return null;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "shopcom");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxmoiixw3/image/upload",
          formData
        );
        console.log(response.data.secure_url);
        return response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    });

    return await Promise.all(uploadPromises);
  };

  // =========================STOCK HANDLE LOGIC===============================

  const handleChange = (size, value) => {
    setStock({ ...stock, [size]: value });
  };

  // =========================POSTING THE DATA TO DATABASE ===============================

  const handleAddProduct = async (e) => {
    e.preventDefault();
    toast.success("addimng  the product please wait");
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (product.images.filter((image) => image !== null).length < 4) {
      toast.error("Please add exactly 4 images before submitting.");
      return; // Prevent form submission
    }

    const imageUrls = await uploadImagesToCloudinary();
    const filteredImages = imageUrls.filter((url) => url !== null);

    if (filteredImages.length < 4) {
      toast("4 images are needed");
      return;
    }
    console.log("images sent", filteredImages);

    const productData = {
      productName,
      description,
      additionalInfo,
      regularPrice,
      salePrice,
      selectedCategory,
      sleeve,
      stock,
      images: filteredImages,
    };

    toast.success("added the product please wait");
    try {
      const response = await axiosInstance.post(
        "/admin/addproduct",
        productData
      );
      console.log(response);
      navigate("/productlist");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out ml-12 sm:ml-64">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,139,0.4)] overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-2">Add Product</h2>
            <div className="text-sm text-gray-500 mb-6">
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>{" "}
              &gt;{" "}
              <Link to="/products" className="hover:underline">
                product
              </Link>{" "}
              &gt; add
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }, (_, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {index === 0
                            ? "Main Image"
                            : `Additional Image ${index}`}
                        </label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-40 flex flex-col items-center justify-center">
                          {product.images[index] ? (
                            <img
                              src={URL.createObjectURL(product.images[index])}
                              alt={`preview-${index}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <>
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-1 text-sm text-gray-600">
                                Click to upload
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Product Information */}
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter Product name here..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                  />
                  {errors.productName && (
                    <span className="text-red-500 text-sm ">
                      {errors.productName}
                    </span>
                  )}
                  {/* Product description */}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Product Description here..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    rows={3}
                    required
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm pb-5 ">
                      {errors.description}
                    </span>
                  )}

                  {/* Additional product information */}
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Enter Additional Information"
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    rows={3}
                  />
                  {errors.additionalInfo && (
                    <span className="text-red-500 text-sm pb-5 ">
                      {errors.additionalInfo}
                    </span>
                  )}
                  {/* Pricing */}
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    placeholder="Enter Regular Price here..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                  />
                  {errors.regularPrice && (
                    <span className="text-red-500 text-sm pb-5 ">
                      {errors.regularPrice}
                    </span>
                  )}
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Enter Sale Price here..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  />
                  {errors.salePrice && (
                    <span className="text-red-500 text-sm pb-5 ">
                      {errors.salePrice}
                    </span>
                  )}
                  {/* Category selection */}
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryDetails.map((x, index) => {
                      if (x.isListed) {
                        return (
                          <option key={index} value={x.category}>
                            {x.category}
                          </option>
                        );
                      }
                    })}
                  </select>

                  {/* Sleeve selection */}
                  <select
                    onChange={(e) => setsleeve(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                  >
                    <option value="">Select Sleeve Type</option>
                    <option value="Full sleeve">Full sleeve</option>
                    <option value="Half sleeve">Half sleeve</option>
                    <option value="Sleeveless">Sleeveless</option>
                  </select>
                </div>
              </div>

              {/* Product Stock */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Stocks Quantity</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.keys(stock).map((size) => (
                    <div className="flex items-center" key={size}>
                      <label className="mr-2">{size}</label>
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={stock[size]}
                        onChange={(e) =>
                          handleChange(size, parseInt(e.target.value) || 0)
                        }
                      />
                      {errors.stock && errors.stock[size] && (
                        <span className="text-red-500 text-sm">
                          {errors.stock[size]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors w-full"
              >
                Add Product
              </button>
            </form>
            {image && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Crop Image</h3>
                  <div
                    className="crop-container"
                    style={{
                      width: "100%",
                      height: "400px",
                      position: "relative",
                    }}
                  >
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={2 / 3}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <Button onClick={saveCroppedImage} className="mt-4">
                    Save Cropped Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getCroppedImg = (imageSrc, crop) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  return getCroppedImg(imageSrc, crop);
};
