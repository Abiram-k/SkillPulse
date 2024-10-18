import React from "react";
import { Link } from "react-router-dom";

function Products() {
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
              <table className="w-full bg-white rounded shadow text-center">
                <thead className="bg-orange-500 text-white">
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
                  <tr className="border-b">
                    <td className="p-2">1</td>
                    <td className="p-2">GameSphere X</td>
                    <td className="p-2">Gaming Console</td>
                    <td className="p-2">Sound core by ankers</td>
                    <td className="p-2">₹9,999</td>
                    <td className="p-2">20</td>
                    <td className="p-2">
                      <img
                        src="https://placehold.co/50x50"
                        alt="Gaming headset"
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                      <Link className="bg-blue-500 p-2 rounded w-full lg:w-28 text-center"to="edit">
                        Edit
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1 rounded w-full lg:w-28">
                        UNLIST
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">2</td>
                    <td className="p-2">GlideMaster Elite</td>
                    <td className="p-2">Gaming Peripherals</td>
                    <td className="p-2">Boat newly launched</td>
                    <td className="p-2">₹14,999</td>
                    <td className="p-2">20</td>
                    <td className="p-2">
                      <img
                        src="https://placehold.co/50x50"
                        alt="Gaming mouse"
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    {/* Updated UNLIST and Edit buttons to be the same width */}
                    <td className="p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                    <Link className="bg-blue-500 p-2 rounded w-full lg:w-28 text-center"to="edit">
                        Edit
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1 rounded w-full lg:w-28">
                        UNLIST
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">3</td>
                    <td className="p-2">ShadowPulse Controller</td>
                    <td className="p-2">Graphics Cards</td>
                    <td className="p-2">Sound core by ankerlife</td>
                    <td className="p-2">₹18,774</td>
                    <td className="p-2">30</td>
                    <td className="p-2">
                      <img
                        src="https://placehold.co/50x50"
                        alt="Graphics card"
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                    <Link className="bg-blue-500 p-2 rounded w-full lg:w-28 text-center"to="edit">
                        Edit
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1 rounded w-full lg:w-28">
                        UNLIST
                      </button>
                    </td>
                  </tr>
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
