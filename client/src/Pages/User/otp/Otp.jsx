import React, { useEffect, useState } from "react";
import OtpInput from "./otpInputBox";
import axios from "axios";
import "./otp.css";
import { useNavigate } from "react-router-dom";
function Otp() {
  const [timer, setTimer] = useState(29);
  const [otp, setOtp] = useState();
  const [resendOtp, setResendOtp] = useState(false);
  const [message, setMessage] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [input, setInput] = useState(false);

  const navigate = useNavigate();
  //for otp timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t > 0) {
          return t - 1;
        } else {
          setResendOtp(true);
          return;
        }
      });
    }, 1000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/otp",
        { otp },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setMessage({ serverError: error.response.data.message });
      }
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    setInput(true);
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
    }, 2000);
    try {
      const response = await axios.post(
        "http://localhost:3000/resendOtp",
        {},
        { withCredentials: true }
      );
      setMessage({ success: response.data.message });
    } catch (error) {
      if (error.response.status === 400) {
        setMessage({ serverError: error.response.data.message });
      }
      console.log(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage({ serverMessage: "" });
    }, 2000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="text-center flex items-center flex-col justify-center h-screen px-4 transition-transform duration-300">
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
      {message.success && (
        <div
          id="notification"
          className="notification"
          itemID="errorNotification"
        >
          {message.success}
        </div>
      )}

      {spinner && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h1
        className="text-white text-6xl font-bold mb-10 "
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        SKILL PULSE
      </h1>
      <div
        className="bg-gray-900 text-gray-200 p-10 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
        style={{ boxShadow: "0 0 5px 5px rgba(255, 0, 0, 0.1)" }}
      >
        <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
        <p className="mb-6">Enter the OTP to confirm</p>
        {input || timer ? (
          <div className="flex items-center justify-end space-x-3 mb-4 text-white">
            <OtpInput
              length={6}
              handleOtpChange={handleOtpChange}
              disable={false}
            />

            <div className=" p-2 rounded-full w-14 h-11">
              <span className="">{timer}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-3 mb-4 text-black">
            <OtpInput length={6} handleOtpChange={handleOtpChange} disable />
            <div className=" p-2 rounded-full w-14 h-11">
              <i class="fa-solid fa-clock-rotate-left text-red-600 text-lg"></i>
            </div>
          </div>
        )}

        {resendOtp && (
          <p
            className="mb-6 rounded text-gray-400 hover:scale-125 cursor-pointer transform transition-transform duration-300"
            onClick={handleResendOtp}
          >
            Resend OTP ?
          </p>
        )}

        <button
          className="bg-red-600 text-white py-2 px-6 mt-2 rounded-full hover:bg-red-700"
          onClick={handleClick}
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
}

export default Otp;
