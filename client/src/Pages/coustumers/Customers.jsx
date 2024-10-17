import React, { useEffect, useState } from "react";
import axios from "axios";
function Customers() {
  const [users, setUsers] = useState({});
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:5173/admin/customers"
        );
        console.log(response);
        console.log(response.data.users);
      } catch (error) {
        console.log(error);
      }
    })();
  },[]);

  return (
    <div className="flex bg-white text-black">
      <div className="flex-1">
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label htmlFor="sort" className="mr-2">
                Sort
              </label>
              <select id="sort" className="border rounded p-1">
                <option>Name</option>
              </select>
            </div>
            <div>
              <label htmlFor="order" className="mr-2">
                By
              </label>
              <select id="order" className="border rounded p-1">
                <option>Ascending</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter" className="mr-2">
                Filter
              </label>
              <select id="filter" className="border rounded p-1">
                <option></option>
              </select>
            </div>
          </div>
          <div className="table-container  p-5 rounded">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="bg-orange-500 text-white p-2">S.No</th>
                  <th className="bg-orange-500 text-white p-2">Name</th>
                  <th className="bg-orange-500 text-white p-2">Email</th>
                  <th className="bg-orange-500 text-white p-2">Mobile</th>
                  <th className="bg-orange-500 text-white p-2">
                    Block/Unblock
                  </th>
                  <th className="bg-orange-500 text-white p-2">Update</th>
                </tr>
              </thead>
              <tbody className=" ">
                {/* You can map through your data here */}

                <tr className="hover:bg-gray-300 bg-orange-900 text-center">
                  <td className="p-2">1</td>
                  <td className="p-2">Ananthu1</td>
                  <td className="p-2">user1@email.com</td>
                  <td className="p-2">9656123456</td>
                  <td className="p-2">
                    <input type="checkbox"  />
                  </td>
                  <td className="p-2">
                    <i className="fas fa-edit text-green-500 mr-2"></i>
                    <i className="fas fa-trash text-red-500"></i>
                  </td>
                </tr>

                {/* Add more rows here */}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination flex justify-between items-center mt-4">
              <button className="bg-black text-white p-2 rounded" disabled>
                &lt;
              </button>
              <span>1 of 10 Pages</span>
              <button className="bg-black text-white p-2 rounded">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
