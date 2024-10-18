import React from "react";
import { Link } from "react-router-dom";

const EditProduct = () => {
  return (
    <form className="bg-gray-200 text-black  p-8 shadow-md rounded-lg font-sans">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex items-center">
          Product Name:
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center">
          Category:
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center col-span-2">
          Description:
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center">
          Regular Price :
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center">
          Sale Price :
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center">
          Brand:
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
        <label className="flex items-center">
          Units:
          <input
            type="text"
            className="ml-2 p-2 border rounded w-full focus:outline-none"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Upload Images :</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <img
              src="https://placehold.co/100x100"
              alt="Placeholder image"
              className="mb-2"
            />
            <button className="bg-gray-200 p-2 rounded">Change image</button>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <img
              src="https://placehold.co/100x100"
              alt="Placeholder image"
              className="mb-2"
            />
            <button className="bg-gray-200 p-2 rounded">Change image</button>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center">
            <img
              src="https://placehold.co/100x100"
              alt="Placeholder image"
              className="mb-2"
            />
            <button className="bg-gray-200 p-2 rounded">Change image</button>
          </div>
        </div>
      </div>
      <Link className="bg-green-500 text-white p-4 rounded w-full flex justify-center"to="/admin/products">
       Submint
      </Link>
    </form>
  );
};

export default EditProduct;
