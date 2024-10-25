import React, { useState } from "react";

const AddAddress = () => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternativeMobile, setAlternativeMobile] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [type, setType] = useState("");
  return (
    <div className="content w-3/4 mx-auto p-6 text-sm">
      <h2 className="text-center mb-8 text-2xl font-semibold">Add Address</h2>
      <form className="max-w-lg mx-auto space-y-6">
        {/* First and Last Name */}
        <div className="flex space-x-4">
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="First Name"
            type="text"
          />
          <input
            className="w-1/2 py-2 px-3 border  border-gray-300 rounded text-black"
            placeholder="Last Name"
            type="text"
          />
        </div>
        {/* Mobile and Alternate Number */}
        <div className="flex space-x-4">
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="Mobile Number"
            type="text"
          />
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="Alternate Number (Optional)"
            type="text"
          />
        </div>

        {/* City/Town and State */}
        <div className="flex space-x-4">
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="City / District / Town"
            type="text"
          />
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="State"
            type="text"
          />
        </div>

        {/* Address */}
        <textarea
          className="w-full py-2 px-3 border border-gray-300 rounded mb-4 text-black"
          placeholder="Address"
        ></textarea>

        {/* Pin Code and Address Type */}
        <div className="flex space-x-4">
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="Pin Code"
            type="text"
          />
          <input
            className="w-1/2 py-2 px-3 border border-gray-300 rounded text-black"
            placeholder="Type"
            type="text"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="block bg-blue-600 text-white py-2 px-4 rounded mx-auto hover:bg-blue-500 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
