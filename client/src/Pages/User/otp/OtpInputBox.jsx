import React, { useState } from 'react';
import './otpInputBox.css'; // Optional for custom styling

const OtpInput = ({ length, handleOtpChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Send the updated OTP value to the parent component
    handleOtpChange(newOtp.join(""));

    // Move focus to the next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="otp-input">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onFocus={(e) => e.target.select()}
          className="otp-field"
        />
      ))}
    </div>
  );
};

export default OtpInput;
