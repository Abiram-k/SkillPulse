import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {context} from "../../../Components/Provider";
import { useContext } from "react";
const Category = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);


  const { setData } = useContext(context);

  const sendDataToEdit = (category) => {
    setData(category);
  };

  useEffect(() => {
    (async () => {
      await axios
        .get("http://localhost:3000/admin/category")
        .then((response) => {
          setCategories(response.data.categories);
        })
        .catch((error) => {
          console.log(error);
          alert(error?.response.data.message);
        });
    })();
  }, []);
  console.log(categories);
  const handleAddCategory = async () => {
    try {
      const response = axios.post(
        "http://localhost:3000/admin/addCategory",
        {
          name,
          description,
        }
        // { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const result = confirm("Are you sure to delete categorie");
    try {
      if (result) {
        const response = await axios.delete(
          `http://localhost:3000/admin/categoryDelete/${id}`
        );
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data.message);
    }
  };
  return (
    <main className="w-4/5 p-8">
      <div className="bg-gray-200 p-4 rounded-lg shadow-md text-black h-80 overflow-y-scroll">
        <table className="w-full text-left ">
          <thead className="">
            <tr className="bg-orange-500 ">
              <th className="p-2">S.No</th>
              <th className="p-2">Category Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">List / Unlist</th>
            </tr>
          </thead>
          <tbody className="">
            {categories?.length > 0 ? (
              categories.map((category, index) => (
                <tr className="border-t" key={category._id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{category.name}</td>
                  <td className="p-2">{category.description}</td>
                  <td className="p-2 flex items-center space-x-3 text-xl">
                    {/* <input type="checkbox" className="mr-2" checked /> */}
                    <button className="bg-blue-600 hover:bg-blue-700 lg:p-2 p-1 rounded w-17 text-xs">
                      List
                    </button>
                    <Link className="" to="edit">
                      <i
                        className="fas fa-edit mr-2"
                        onClick={() => sendDataToEdit(category)}
                      ></i>
                    </Link>
                    <i
                      className="fas fa-trash-alt"
                      onClick={() => handleDelete(category._id)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="p-2 font-bold  ">
                  NO categorie were added Yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-200 p-4 mt-8 rounded-lg shadow-md text-black">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form className="flex items-center flex-col space-x-2 space-y-3 lg:flex-row">
          <label className="mr-2">Name :</label>
          <input
            type="text"
            className="border p-2 rounded-lg flex-grow font-mono"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="mr-2">Description :</label>
          <input
            type="text"
            className="border p-2 rounded-lg flex-grow font-mono"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-lg ml-4"
            onClick={handleAddCategory}
          >
            SAVE
          </button>
        </form>
      </div>
    </main>
  );
};

export default Category;
