import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [serverMessage, setServerMessage] = useState();
  const navigate = useNavigate();
  //Form Validation

  let error = {};
  const formValidate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const firstnameFirstCharecter = firstName.charAt(0);
    const lastnameFirstCharecter = lastName.charAt(0);
    if (!firstName && !lastName && !mobileNumber && !email) {
      error.all = "Please fill all the fields";
    }
    if (!firstName.trim()) {
      error.firstName = "Name is required.";
    } else if (!isNaN(firstnameFirstCharecter)) {
      error.firstName = "Name must start with a charecter";
    }
    if (!isNaN(lastnameFirstCharecter) && lastName && firstName) {
      error.secondName = "Last name must start with a charecter";
    }
    if (!email.trim()) {
      error.email = "email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Email is invalid.";
    }
    if (!password.trim()) {
      error.password = "Password is required.";
    } else if (password.length < 8) {
      error.password = "Password must be 8 characters";
    } else if (password != confirmPassword) {
      error.password = "Password not match";
    }
    if (!mobileNumber.trim()) {
      error.mobile = "Mobile number is required.";
    } else if (mobileNumber.length != 10) {
      error.mobile = "Please enter 10 digit mobile number.";
    }
    return error;
  };

  const notification = document.getElementById("errorNotification");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage({ serverMessage: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    try {
      const formErrors = formValidate();
      console.log("FormErrors: ", formErrors);
      if (Object.keys(formErrors).length > 0) {
        setMessage(formErrors);
        return;
      }else{
        setSpinner(true);
        setTimeout(() => {
          setSpinner(false);
        }, 3000);
      }
      console.log(message);
      //   if (message) {
      //     notification.style.display = "block";
      //   setTimeout(() => (notification.style.display = "none"), 3000);
      //   }
      const response = await axios.post(
        "http://localhost:3000/signUp",
        {
          firstName,
          lastName,
          email,
          mobileNumber,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      console.log("Response data is:", response.data);
      if (response.status === 200) {
        navigate("/otp");
        setMessage({ success: response.data.message });

        // setTimeout(() => {
        //   navigate("/otp");
        // }, 2000);
      }
    } catch (error) {
      setMessage({ serverError: error?.response?.data.message });
      console.log(error);
      setSpinner(true);

      //   notification.style.display = "block";
      //   setTimeout(() => {
      //     notification.style.display = "none";
      //   }, 2000);
    }
  };
  // const handleGoogleAuth = async () => {
  //   try {
  //     await axios.get(
  //       "http://localhost:3000/auth/google",
  //       {},
  //       { withCredentials: true }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  return (
    <div className="text-white text-center my-10">
      {/* popup notification */}
      {message.serverError && (
        <div
          id="notification"
          className=" error notification"
          itemID="errorNotification"
        >
          {message.serverError}
        </div>
      )}

      {spinner && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h1 className="text-5xl font-bold mb-10">SKILL PULSE</h1>
      <div
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 mx-auto font-mono"
        style={{ boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)" }}
      >
        <h2 className="text-2xl font-bold mb-6">SIGN UP</h2>
        <form className="space-y-4 " onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
            />
          </div>
          {message.firstName && !message.all && (
            <p className="error">{message.firstName}</p>
          )}
          {message.secondName && !message.all && (
            <p className="error">{message.secondName}</p>
          )}
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
          />
          {message.email && !message.all && (
            <p className="error">{message.email}</p>
          )}

          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobile(e.target.value)}
            className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
          />
          {message.mobile && !message.all && (
            <p className="error">{message.mobile}</p>
          )}

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-transparent border-b border-gray-600 focus:outline-none w-full py-2"
          />
          {message.password && !message.all && (
            <p className="error">{message.password}</p>
          )}
          {message.all && <p class="error">{message.all}</p>}
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-4 rounded-full mt-4"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Existing User?
          <Link to="/login" className="text-blue-500">
            Login in
          </Link>
        </p>
      </div>

      <p className="mt-6">CONTINUE WITH</p>
      <a
        onClick={handleGoogleAuth}
        className="mt-2 flex items-center justify-center cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 48 48"
          className="w-24 h-10"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      </a>
    </div>
  );
};

export default Signup;
