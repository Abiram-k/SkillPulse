import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/getProduct"
        );
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    })();
  }, []);

  const handleListing = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/admin/handleProductListing/${id}`
      );
      if (response.data.category.isListed) {
        Swal.fire({
          title: "Blocked",
          text: `${response.data.category.name}
            "Listed successfully`,
          icon: "sucess",
          confirmButtonText: "Done",
        });
      } else {
        Swal.fire({
          title: "Unblocked",
          text: `${response.data.category.name}
            "Unlisted successfully`,
          icon: "success",
          confirmButtonText: "Done",
        });
      }
      const updatedCategory = response.data.category;

      setCategories((prevCat) =>
        prevCat.map((cate) =>
          cate._id == updatedCategory._id ? updatedCategory : cate
        )
      );
    } catch (error) {
      console.log(error);
      alert(error?.response?.data.message || "Error occured at line 115");
    }
  };
  return (
    <>
      <Link
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 block sm:inline-block"
        to="add"
      >
        <i className="fas fa-plus mr-2"></i> Add Product
      </Link>

      <main className="flex-1 p-6 bg-white text-black">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
          <button className="flex items-center text-gray-600 mb-4 lg:mb-0">
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-4 py-2 w-full lg:w-auto"
            />
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Sort</span>
              <select className="border rounded px-2 py-1">
                <option>Product Name</option>
              </select>
              <span className="font-semibold">By</span>
              <select className="border rounded px-2 py-1">
                <option>Ascending</option>
                <option>Descending</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Filter</span>
              <select className="border rounded px-2 py-1">
                <option>Price</option>
                <option>Category</option>
                <option>Brand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Added overflow-x-auto to handle mobile overflow */}

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-center font-mono">
            <thead className="bg-orange-500 text-white ">
              <tr>
                <th className="p-2">S.No</th>
                <th className="p-2">Product Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Sale Price</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Image</th>
                <th className="p-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{product.productName}</td>
                    <td className="p-2">{"not Fetched"}</td>
                    <td className="p-2">{product.productDescription}</td>
                    <td className="p-2">{product.salesPrice}</td>
                    <td className="p-2">{product.units}</td>
                    <td className="p-2">
                      <img
                        src={
                          product.productImage[0] ||
                          "https://placehold.co/50x50"
                        }
                        alt="Gaming headset"
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                      <Link
                        className="bg-blue-500 p-2 rounded w-full lg:w-28 text-center"
                        to="edit"
                      >
                        Edit
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1 rounded w-full lg:w-28">
                        UNLIST
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b text-center p-5">
                  <td className="text-center font-bold">
                    No products were added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 border rounded">{"<"}</button>
          <span className="px-4 py-2">1</span>
          <button className="px-4 py-2 border rounded">{">"}</button>
        </div>
      </main>
    </>
  );
}

export default Products;
