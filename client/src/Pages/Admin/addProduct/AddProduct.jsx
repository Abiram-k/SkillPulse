import React, { useEffect, useState } from "react";
import { Link, useAsyncError } from "react-router-dom";
import { Toast } from "../../../Components/Toast";
import axios from "axios";
const AddProduct = () => {
  const [message, setMessage] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [units, setUnits] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const error = {};
  const validateForm = () => {
    const salesPriceInt = Number(salesPrice);
    const regularPriceInt = Number(regularPrice);
    const unitsInt = Number(units);
    if (name.trim() === "") error.name = "Name is required *";
    if (category.trim() === "") error.category = "Category is required *";
    if (description.trim() === "")
      error.description = "description is required *";
    if (category.trim() === "") error.category = "Category is required *";
    if (regularPrice.trim() === "")
      error.regularPrice = "regularPrice is required *";
    else if (isNaN(regularPriceInt))
      error.regularPrice = "regular price must a number";

    if (salesPrice.trim() === "") error.salesPrice = "salesPrice is required *";
    else if (regularPrice < salesPrice)
      error.salesPrice =
        "Sales price must be less than or equal to regular price *";
    else if (isNaN(salesPriceInt))
      error.salesPrice = "Sales price must a number";

    if (brand.trim() === "") error.brand = "brand is required *";
    if (units.trim() === "") error.units = "units is required *";
    else if (isNaN(unitsInt)) error.units = "Units  must a number";

    if (Object.values(images).some((value) => !value)) {
      error.image = "Upload at least three images *";
    }

    return error;
  };

 

  const handleImageChange = (e, field) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => ({
          ...prevImages,
          [field]: reader.result, //field is image1,image2,image3
        }));
      };
      reader.readAsDataURL(imageFile); //base64 happening here.
    }
  };

  const handleAddproduct = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    setMessage(formErrors);
    console.log(productImage);
    const formData = new FormData();
    formData.append("productName", name);
    formData.append("productDescription", description);
    formData.append("category", category);
    formData.append("salesPrice", salesPrice);
    formData.append("regularPrice", regularPrice);
    formData.append("brand", brand);
    formData.append("units", units);
    productImage.forEach((image, index) => {
      formData.append("file", image);
    });
    try {
      // console.log(Object.keys(formErrors.length) )
      if (Object.keys(formErrors).length === 0) {
        setSpinner(true);
        const response = await axios.post(
          "http://localhost:3000/admin/addProduct",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSpinner(false);

        Toast.fire({
          icon: "success",
          title: `${response.data.message}`,
        });
      }
    } catch (error) {
      // alert(error.response.data.message);
      // if (!validateForm()) {
      setSpinner(false);
      Toast.fire({
        icon: "error",
        title: `${error.response?.data.message}`,
      });
      // }
      // console.log(error);
      // alert(error.response.data.message);
    }
  };

  const handleProductImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setProductImage((prevImages) => {
        return [...prevImages, imageFile];
      });
    }
  };

  return (
    <form className="bg-gray-200 text-black  p-8 shadow-md rounded-lg font-sans">
      {spinner && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="flex items-center">
            Name:
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {message.name && <p className="text-red-600">{message.name}</p>}
        </div>
        <div>
          <label className="flex items-center">
            Category:
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          {message.category && (
            <p className="text-red-600">{message.category}</p>
          )}
        </div>
        <div>
          <label className="flex items-center col-span-2">
            Description:
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {message.description && (
            <p className="text-red-600">{message.description}</p>
          )}
        </div>
        <div>
          <label className="flex items-center">
            Sale Price :
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={salesPrice}
              onChange={(e) => setSalesPrice(e.target.value)}
            />
          </label>
          {message.salesPrice && (
            <p className="text-red-600">{message.salesPrice}</p>
          )}
        </div>
        <div>
          <label className="flex items-center">
            Brand:
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </label>
          {message.brand && <p className="text-red-600">{message.brand}</p>}
        </div>
        <div>
          <label className="flex items-center">
            Regular Price :
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
            />
          </label>
          {message.regularPrice && (
            <p className="text-red-600">{message.regularPrice}</p>
          )}
        </div>
        <div>
          <label className="flex items-center">
            Units:
            <input
              type="text"
              className="ml-2 p-2 border rounded w-full focus:outline-none"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
          </label>
          {message.units && <p className="text-red-600">{message.units}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Upload Images :</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <label htmlFor="fileInputone">
              <img
                src={images.image1 || "https://placehold.co/100x100"}
                alt="product image"
                className="mb-2"
              />
            </label>
            <input
              id="fileInputone"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e, "image1");
                handleProductImageChange(e);
              }}
              style={{ display: "none" }}
            />
            <p className="bg-gray-200 p-2 rounded">Change image</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <label htmlFor="fileInputtwo">
              <img
                src={images.image2 || "https://placehold.co/100x100"}
                alt="product image"
                className="mb-2"
              />
            </label>
            <input
              id="fileInputtwo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e, "image2");
                handleProductImageChange(e);
              }}
              style={{ display: "none" }}
            />
            <p className="bg-gray-200 p-2 rounded">Change image</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <label htmlFor="fileInputThree">
              <img
                src={images.image3 || "https://placehold.co/100x100"}
                alt="product image"
                className="mb-2"
              />
            </label>
            <input
              id="fileInputThree"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e, "image3");
                handleProductImageChange(e);
              }}
              style={{ display: "none" }}
            />
            <p className="bg-gray-200 p-2 rounded">Change image</p>
          </div>
        </div>
        {message.image && (
          <p className="text-red-600 text-center">{message.image}</p>
        )}
      </div>
      <button
        className="bg-green-500 text-white p-4 rounded w-full flex justify-center"
        type="submit"
        // to="/admin/products"
        onClick={(e) => handleAddproduct(e)}
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
