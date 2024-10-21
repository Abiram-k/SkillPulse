import React from "react";
import loginImage from "../../../assets/login-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addUser } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import Notification from "../../../Components/Notification";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let error = {};
  const formValidate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      error.email = "email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Email is invalid.";
    }
    if (!password.trim()) {
      error.password = "Password is required.";
    } else if (password.length < 8) {
      error.password = "Password is incorrect";
    }
    return error;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({});
    const errors = formValidate();
    console.log("Error object for validation:", errors);

    if (Object.keys(errors).length > 0) {
      setMessage(errors);
      return;
    }
    try {
      console.log(email, password);
      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(addUser(response.data.user));
        setMessage({ response: response?.data?.message });
        navigate("/user/home");
      }
    } catch (err) {
      setMessage({ response: err?.response?.data?.message });
    }
  };
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ps-10 sm:ps-0  ms-80 sm:ms-auto">
      <h1 className="text-white sm:text-6xl sm:mb-10 mb-5 text-[24px]">
        SKILL PULSE
      </h1>
      {message.response && <Notification message={message.response} />}
      <div
        className="bg-[#1C1C1C] rounded-lg shadow-lg sm:flex sm:items-center p-8 sm:flex-row "
        style={{ width: "600px", boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)" }}
      >
        <div className="flex justify-center mr-10">
          <img
            src={loginImage}
            alt="A person with headphones in a red and black theme"
            className="rounded-full w-48 h-32"
          />
        </div>
        <div className="flex flex-col font-mono">
          <h2 className="text-white text-2xl text-center mb-6 text-large font-bold tracking-wide">
            LOGIN
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" p-2 mx-28 sm:mx-0 rounded w-3/4 sm:w-full bg-gray-800 text-white border-b-2 border-gray-600 focus:outline-none"
              />
              {message.email && <p className="error">{message.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded p-2 mx-28 sm:mx-0 w-3/4 sm:w-full bg-gray-800 text-white border-b-2 border-gray-600 focus:outline-none"
              />
              {message.password && <p className="error">{message.password}</p>}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700"
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <a href="#" className="text-gray-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="text-center mt-2">
            <Link
              to="/signup"
              className="text-gray-400 text-sm hover:underline"
            >
              Don't have an account?
              <span className="text-white">
                Create an <br /> account
              </span>
            </Link>
          </div>
        </div>
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
}

export default Login;
