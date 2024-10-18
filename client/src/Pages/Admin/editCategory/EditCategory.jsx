import React, { useState } from "react";
import axios from "axios";
import { useContext, useEffect } from "react";
import { context } from "../../../Components/Provider";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../../Components/Toast";
function EditCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const { data } = useContext(context); //to field data by default

  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setId(data._id || "");
    }
  }, [data]);

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/admin/editCategory",
        { id, name, description }
      );

    //   Toast.fire({
    //     icon: 'success',
    //     title: `${response.data.message}`
    //   });
      console.log(response.data);
      navigate("/admin/category");
    } catch (error) {
      console.log(error?.response?.data?.message);
    //   Toast.fire({
    //     icon: 'error',
    //     title: `${error?.response?.data?.message}`
    //   });
    alert(error?.response?.data?.message)
    }
  };

  return (
    <div className="bg-gray-200 p-4 mt-8 rounded-lg shadow-md text-black ">
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>
      <form className="flex items-center flex-col space-x-2 space-y-3  ">
        <label className="mr-2">Name :</label>
        <input
          type="text"
          className="border p-2 rounded-lg flex-grow w-1/2 focus:outline-none font-mono"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="mr-2">Description :</label>
        <input
          type="text"
          className="border p-2 rounded-lg flex-grow w-1/2 focus:outline-none font-mono"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-lg ml-4"
          onClick={(e) => handleEditCategory(e)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
