import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".com")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/login-farmer", {
        email,
        password,
      });

      if (response.data.success) {
        setTimeout(() => {
          navigate("/app");
        }, 1000);
      } else {
        setErrorMessage("Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        <div className="text-center -mt-16">
          <h1 className="font-grotesk font-extrabold text-6xl text-green-800">
            SowSmart
          </h1>
        </div>

        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">
            Welcome
          </p>
          <p className="font-grotesk text-lg text-green-600">
            Log In to your account
          </p>
        </div>

        <div className="w-3/4 flex flex-col items-center space-y-6">
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          </>
        </div>

        <button
          className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
          onClick={handleLogin}
        >
          Log in
        </button>

        <p className="text-center">
          No account?{" "}
          <Link to="/signup" className="underline hover:text-blue-500">
            Sign up
          </Link>
        </p>

        {errorMessage && (
          <div className="message font-grotesk text-red-600">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="message font-grotesk text-green-600">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
