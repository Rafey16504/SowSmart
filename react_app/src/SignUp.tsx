import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");

  const navigate = useNavigate();

  const sendEmail = async () => {
    if (email) {
      if (email.includes(".com") && email.includes("@")) {
        setSuccessfulMessage("Please wait for verification...");
        try {
          const { data } = await axios.post("http://localhost:8000/send-email/", {
            email: email,
          });

          setIsVerificationVisible(true);
          setSuccessfulMessage("Check your email for the verification code!");
          if (data.message) {
            setVerificationCode(data.message);
          }
        } catch (error) {
          setUnsuccessfulMessage("Error sending email. Please try again!");
        }
      } else {
        setUnsuccessfulMessage("Please enter a valid Email!");
      }
    } else {
      setUnsuccessfulMessage("Please fill in your email!");
    }

    setTimeout(() => {
      setUnsuccessfulMessage("");
      setSuccessfulMessage("");
    }, 2000);
  };

  const verifyCode = () => {
    if (userInputCode === verificationCode) {
      setSuccessfulMessage("Verification successful!");
      setTimeout(() => {
        navigate("/input-details");
      }, 1000);
    } else {
      setUnsuccessfulMessage("Invalid code. Please try again.");
    }
    setTimeout(() => {
      setUnsuccessfulMessage("");
    }, 2000);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        <div className="text-center -mt-16">
          <h1 className="font-grotesk font-extrabold text-6xl text-green-800">SowSmart</h1>
        </div>

        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">Welcome</p>
          <p className="font-grotesk text-lg text-green-600">Sign Up</p>
        </div>

        <div className="w-3/4 flex flex-col items-center space-y-6">
          {!isVerificationVisible ? (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          ) : (
            <input
              type="text"
              placeholder="Enter verification code"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          )}
        </div>

        {!isVerificationVisible ? (
          <button
            className="bg-green-800 rounded-full px-16 py-3 text-white font-semibold w-3/4"
            onClick={sendEmail}
          >
            Sign Up
          </button>
        ) : (
          <button
            className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
            onClick={verifyCode}
          >
            Verify
          </button>
        )}

        {unsuccessfulMessage && <div className="message font-grotesk text-red-600">{unsuccessfulMessage}</div>}
        {successfulMessage && <div className="message font-grotesk text-green-600">{successfulMessage}</div>}
      </div>
    </div>
  );
};

export default SignUp;
