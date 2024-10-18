import React, { useEffect, useState } from "react";
import axios from "axios";
const Customers = () => {
  const [users, setUsers] = useState({});
  // const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/customers"
        );
        console.log(response.data.users);
        setUsers(response.data.users);
        // console.log(users);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    })();
  }, []);

  const handleblocking = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/block/${id}`
      );
      if (response.data.user.isBlocked) {
        Swal.fire({
          title: "Blocked",
          text: `${response.data.name}
            "Blocked successfully`,
          icon: "sucess",
          confirmButtonText: "Done",
        });
      } else {
        Swal.fire({
          title: "Unblocked",
          text: `${response.data.name}
            "Unblocked successfully`,
          icon: "success",
          confirmButtonText: "Done",
        });
      }
      const updatedUser = response.data.user;
      //to change particular user object after block or unbloking
      setUsers((prevUser) =>
        prevUser.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
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

              <select
                id="order"
                className="border rounded p-1"
                // value={filterUser}
                // onChange={(e) => setFilterUser(e.target.value)}
              >
                <option>Recently added</option>
                <option>name</option>
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
                  {/* <th className="bg-orange-500 text-white p-2">Update</th> */}
                </tr>
              </thead>
              <tbody className="font-sans">
                {users.length > 0 ? (
                  // filterUser === "Recently added"
                  users.map((user, index) => (
                    <tr
                      className=" bg-white text-center border-b-2 border-gray-200"
                      key={user._id}
                    >
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{user.firstName}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.mobileNumber}</td>
                      <td className="p-2">
                        <button
                          className={
                            user.isBlocked
                              ? "bg-blue-600 hover:bg-blue-700 lg:p-2 p-1 rounded w-17"
                              : "bg-red-600 hover:bg-red-700 lg:p-2 p-1 rounded w-22"
                          }
                          onClick={() => handleblocking(user._id)}
                        >
                          {user.isBlocked ? "Unblock" : "block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="hover:bg-gray-300 bg-white text-center"
                    >
                      No users found
                    </td>
                  </tr>
                )}

                {/* Add more rows here */}
              </tbody>
            </table>

            {/* Pagination */}
            {/* <div className="pagination flex justify-between items-center mt-4">
              <button className="bg-black text-white p-2 rounded" disabled>
                &lt;
              </button>
              <span>1 of 10 Pages</span>
              <button className="bg-black text-white p-2 rounded">&gt;</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
