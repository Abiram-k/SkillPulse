import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { context } from "../../../Components/Provider";
import { useContext, useRef } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const searchFocus = useRef(null);
  const { setData } = useContext(context);

  //to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  //to send data to edit product page
  const sendDataToEdit = (product) => {
    console.log("from product:", product);
    setData(product);
  };
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
    searchFocus.current.focus();
  }, []);

  const handleListing = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/admin/handleProductListing/${id}`
      );
      console.log(response.data);
      if (response.data.product.isListed) {
        Swal.fire({
          title: "Unlisted",
          text: `${response.data.product.productName}
            Listed successfully`,
          icon: "sucess",
          confirmButtonText: "Done",
        });
      } else {
        Swal.fire({
          title: "Listed",
          text: `${response.data.product.productName}
            Unlisted successfully`,
          icon: "success",
          confirmButtonText: "Done",
        });
      }
      const updatedProduct = response.data.product;

      setProducts((prevPro) =>
        prevPro.map((product) =>
          product._id == updatedProduct._id ? updatedProduct : product
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
          <button
            className="flex items-center text-gray-600 mb-4 lg:mb-0"
            onClick={handleRefresh}
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-4 py-2 w-full lg:w-auto"
              value={search}
              ref={searchFocus}
              onChange={(e) => setSearch(e.target.value)}
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
                products
                  .filter(
                    (product) =>
                      search.length === 0 ||
                      product.productName
                        .toLowerCase()
                        .startsWith(search.toLowerCase())
                  )
                  .map((product, index) => (
                    <>
                      <tr className="border-b" key={product._id}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{product.productName}</td>
                        <td className="p-2">
                          {product.category?.name || "not Fetched"}
                        </td>
                        <td className="p-2">{product.productDescription}</td>
                        <td className="p-2">{product.salesPrice}</td>
                        <td className="p-2">{product.units}</td>
                        <td className="p-2">
                          <img
                            src={
                              product.productImage[0] ||
                              "https://placehold.co/50x50"
                            }
                            alt={product.productName}
                            className="w-12 h-12 object-cover mx-auto"
                          />
                        </td>
                        <td className="p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 align-middle justify-center">
                          <Link to="edit">
                            <i
                              className="fas fa-edit mr-2"
                              onClick={() => sendDataToEdit(product)}
                            ></i>
                          </Link>
                          <button
                            className={
                              product.isListed
                                ? "bg-red-600 hover:bg-red-700 lg:p-2 p-1 rounded w-22 w-1/2 font-mono"
                                : "bg-blue-600 hover:bg-blue-700 lg:p-2 p-1 rounded w-17 w-1/2 font-mono"
                            }
                            onClick={() => handleListing(product._id)}
                          >
                            {product.isListed ? "Unlist" : "List"}
                          </button>
                        </td>
                      </tr>

                      <div className="flex justify-center mt-4">
                        <button className="px-4 py-2 border rounded">
                          {"<"}
                        </button>
                        <span className="px-4 py-2">1</span>
                        <button className="px-4 py-2 border rounded">
                          {">"}
                        </button>
                      </div>
                    </>
                  ))
              ) : (
                <tr className="border-b text-center">
                  <td className="text-center font-bold  p-6">
                    NO PRODUCT WERE ADDED YET !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default Products;
