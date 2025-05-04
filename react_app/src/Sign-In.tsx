import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

const BASE_URL = "https://sowsmart.onrender.com/";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();

  const showTempMessage = (
    type: "success" | "error",
    message: string,
    duration = 3000
  ) => {
    if (type === "success") {
      setSuccessMessage(message);
    } else {
      setErrorMessage(message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, duration);
  };

  const handleLogin = async () => {
    console.log(`Attempting login with email: "${email}" and password: "${password}"`);
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      console.log("Validation failed: Email or password empty");
      showTempMessage("error", "Please fill in both email and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".com")) {
      console.log(`Validation failed: Invalid email format: "${email}"`);
      showTempMessage("error", "Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}login-farmer`, {
        email,
        password,
      });

      if (response.data.success) {
        console.log(`Login successful for user: "${email}"`);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/home");
        }, 1500);
      } else {
        console.log(`Login failed: Incorrect credentials for "${email}"`);
        showTempMessage("error", "Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      showTempMessage("error", "Login failed. Please try again.");
    }
  };

  const handleSendCode = async () => {
    console.log(`Sending reset code to email: "${email}"`);
    if (!email) {
      console.log("Validation failed: No email entered.");
      showTempMessage("error", "Please enter your email.");
      return;
    }

    try {
      showTempMessage("success", "Sending code to your email...");
      const res = await axios.post(`${BASE_URL}send-reset-code`, { email });

      setCode("");
      setNewPassword("");

      if (res.data.success) {
        console.log(`Reset code successfully sent to "${email}"`);
        setCodeSent(true);
        showTempMessage("success", "Verification code sent. Please check your email.");
      } else {
        console.log(`Reset code failed: Email not found - "${email}"`);
        showTempMessage("error", "Email not found.");
      }
    } catch (err) {
      console.error("Reset code request failed:", err);
      showTempMessage("error", "Failed to send verification code.");
    }
  };

  const handleResetPassword = async () => {
    console.log(`Attempting password reset with code: "${code}" and newPassword: "${newPassword}"`);

    if (!code || !newPassword) {
      console.log("Validation failed: Missing code or new password.");
      showTempMessage("error", "Please enter both code and new password.");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}reset-password`, {
        email,
        code,
        newPassword,
      });

      if (res.data.success) {
        console.log(`Password reset successful for "${email}". Redirecting to login.`);
        showTempMessage("success", "Password reset successful. You can now log in.");
        setForgotMode(false);
        setCodeSent(false);
        setPassword("");
        setCode("");
        setNewPassword("");
      } else {
        console.log(`Password reset failed: New password same as old for "${email}"`);
        showTempMessage("error", "New password must be different from the old password.");
      }
    } catch (err) {
      console.error("Reset password request failed:", err);
      showTempMessage("error", "Password reset failed.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (forgotMode) {
        if (codeSent) {
          handleResetPassword();
        } else {
          handleSendCode();
        }
      } else {
        handleLogin();
      }
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white animate-fade-in">
        <Helix size="90" speed="1.5" color="black" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        <h1 className="font-grotesk font-extrabold text-6xl text-green-800 -mt-16">SowSmart</h1>

        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">
            {forgotMode ? "Reset Password" : "Welcome"}
          </p>
          <p className="font-grotesk text-lg text-green-600">
            {forgotMode ? "Enter your email to receive reset code" : "Log In to your account"}
          </p>
        </div>

        <div className="w-3/4 flex flex-col items-center space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
            required
          />

          {!forgotMode && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          )}

          {forgotMode && codeSent && (
            <>
              <input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              />
            </>
          )}
        </div>

        {forgotMode ? (
          codeSent ? (
            <button
              className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          ) : (
            <button
              className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
              onClick={handleSendCode}
            >
              Send Reset Code
            </button>
          )
        ) : (
          <button
            className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
            onClick={handleLogin}
          >
            Log in
          </button>
        )}

        <div className="text-center">
          {!forgotMode ? (
            <p
              onClick={() => {
                console.log("Switched to Forgot Password mode");
                setForgotMode(true);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="cursor-pointer underline text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </p>
          ) : (
            <p
              onClick={() => {
                console.log("Returning to Login mode");
                setForgotMode(false);
                setCodeSent(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="cursor-pointer underline text-sm text-blue-600 hover:text-blue-800"
            >
              Back to Login
            </p>
          )}
        </div>

        <p className="text-center">
          No account?{" "}
          <Link to="/signup" className="underline hover:text-blue-500">
            Sign up
          </Link>
        </p>

        {errorMessage && (
          <div className="message font-grotesk text-red-600">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="message font-grotesk text-green-600">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
