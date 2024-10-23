

import React, { useContext, useEffect, useState } from "react";
import { Toast } from "../../../Components/Toast";
import axios from "axios";
import { context } from "../../../Components/Provider";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

const EditProduct = () => {
  const [id, setId] = useState("");
  const [message, setMessage] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [units, setUnits] = useState("");
  const [images, setImages] = useState({ image1: "", image2: "", image3: "" });
  const [imageToCrop, setImageToCrop] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentField, setCurrentField] = useState(null);

  const navigate = useNavigate();
  const { data } = useContext(context);

  useEffect(() => {
    setId(data?._id || "");
    setName(data?.productName || "");
    setCategory(data?.category?.name || "");
    setDescription(data?.productDescription || "");
    setRegularPrice(data?.regularPrice || "");
    setSalesPrice(data?.salesPrice || "");
    setBrand(data?.brand || "");
    setUnits(data?.units || "");
    setImages({
      image1: data?.productImage[0] || "",
      image2: data?.productImage[1] || "",
      image3: data?.productImage[2] || "",
    });
  }, [data]);

  const validateForm = () => {
    const error = {};
    const salesPriceStr = String(salesPrice);
    const regularPriceStr = String(regularPrice);
    const unitsStr = String(units);
    const salesPriceInt = Number(salesPriceStr);
    const regularPriceInt = Number(regularPriceStr);
    const unitsInt = Number(unitsStr);

    if (!name.trim()) error.name = "Name is required *";
    if (!category.trim()) error.category = "Category is required *";
    if (!description.trim()) error.description = "Description is required *";
    if (!regularPriceStr.trim())
      error.regularPrice = "Regular price is required *";
    else if (isNaN(regularPriceInt))
      error.regularPrice = "Regular price must be a number *";

    if (!salesPriceStr.trim()) error.salesPrice = "Sales price is required *";
    else if (regularPriceInt < salesPriceInt)
      error.salesPrice =
        "Sales price must be less than or equal to regular price *";
    else if (isNaN(salesPriceInt))
      error.salesPrice = "Sales price must be a number *";

    if (!brand.trim()) error.brand = "Brand is required *";

    if (!unitsStr.trim()) error.units = "Units are required *";
    else if (isNaN(unitsInt)) error.units = "Units must be a number *";

    return error;
  };

  const handleImageChange = (e, field) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setImageToCrop(imageUrl);
      setCurrentField(field);
      setCroppedImage(null); // Reset cropped image
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleCropComplete = async (croppedAreaPixels) => {
    try {
      const croppedImg = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setCroppedImage(croppedImg); // Save the cropped image
    } catch (error) {
      console.error("Error cropping image: ", error);
    }
  };

  const handleSaveCroppedImage = () => {
    if (currentField && croppedImage) {
      const croppedImageFile = new File(
        [croppedImage],
        `${currentField}.jpg`,
        { type: "image/jpeg" }
      );
      const imageUrl = URL.createObjectURL(croppedImageFile);
      setImages((prevImages) => ({
        ...prevImages,
        [currentField]: imageUrl,
      }));
      // Reset states
      setCroppedImage(null);
      setImageToCrop("");
      setCurrentField(null);
      setZoom(1); // Reset zoom
      setCrop({ x: 0, y: 0 }); // Reset crop
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setMessage(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    const formData = new FormData();
    formData.append("productName", name);
    formData.append("productDescription", description);
    formData.append("category", category);
    formData.append("salesPrice", salesPrice);
    formData.append("regularPrice", regularPrice);
    formData.append("brand", brand);
    formData.append("units", units);
    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append(key, images[key]); // Ensure to append image files, not URLs
      }
    });

    try {
      setSpinner(true);
      const response = await axios.put(
        `http://localhost:3000/admin/editProduct/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setSpinner(false);
      Toast.fire({ icon: "success", title: `${response.data.message}` });
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      setSpinner(false);
      Toast.fire({ icon: "error", title: `${error.response?.data.message}` });
    }
  };

  return (
    <form
      className="bg-gray-200 text-black p-8 shadow-md rounded-lg font-sans"
      onSubmit={handleEditProduct}
    >
      {spinner && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Upload Images:</label>
          <div className="grid grid-cols-3 gap-4">
            {["image1", "image2", "image3"].map((field, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center"
              >
                <label htmlFor={`fileInput${index}`}>
                  <img
                    src={images[field] || "https://placehold.co/100x100"}
                    alt="product"
                    className="mb-2"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </label>
                <input
                  id={`fileInput${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field)}
                  style={{ display: "none" }}
                />
                <p className="bg-gray-200 p-2 rounded">Change image</p>
                {currentField === field && imageToCrop && (
                  <div
                    className="crop-container"
                    style={{
                      width: "100%",
                      height: "300px",
                      position: "relative",
                    }}
                  >
                    <Cropper
                      image={imageToCrop} // Ensure the selected image is passed
                      crop={crop}
                      zoom={zoom}
                      aspect={2 / 3}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                )}
                {currentField === field && croppedImage && (
                  <>
                    <button
                      type="button"
                      className="bg-blue-500 text-white mt-2 p-2 rounded"
                      onClick={handleSaveCroppedImage}
                    >
                      Save Cropped Image
                    </button>
                    <img
                      src={URL.createObjectURL(croppedImage)} // Show cropped image
                      alt="Cropped"
                      className="mt-2"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          {/* Your other form fields */}
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Update Product
          </button>
        </div>
      </div>
      {message && (
        <div className="text-red-600 mt-4">
          {Object.values(message).map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default EditProduct;
