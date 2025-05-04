import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "https://sowsmart.onrender.com/";

const InputDetails = () => {
  const [farmerName, setFarmerName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    console.log("Form submitted with values:");
    console.log({
      farmerName,
      gender,
      dob,
      phoneNumber,
      password,
      confirmPassword,
      email,
    });

    if (
      !farmerName ||
      !gender ||
      !dob ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      console.log("Validation failed: One or more fields are empty.");
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    if (phoneNumber.length !== 11) {
      console.log(`Validation failed: Invalid phone number "${phoneNumber}"`);
      setErrorMessage("Phone number should be 11 digits.");
      return;
    }

    if (password !== confirmPassword) {
      console.log(`Validation failed: Passwords do not match. Entered: "${password}" and "${confirmPassword}"`);
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      console.log("Validation passed. Navigating to /city-details with user data.");
      setSuccessMessage("Details accepted. Proceeding...");
      setTimeout(() => {
        navigate("/city-details", {
          state: {
            name: farmerName,
            gender,
            dob,
            phoneNumber,
            email,
            password,
          },
        });
      }, 1000);
    } catch (error) {
      console.error("Navigation error. Failed to move to /city-details:", error);
      setErrorMessage("There was an error registering. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-10 flex flex-col items-center space-y-10">
        <h2 className="text-4xl font-grotesk font-extrabold text-green-800 text-center">
          Tell us about you
        </h2>

        {errorMessage && (
          <div className="font-grotesk text-red-600 bg-red-100 w-full p-3 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="font-grotesk text-green-600 bg-green-100 w-full p-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-10">
          <input
            type="text"
            placeholder="Farmer Name"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk text-gray-700"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2 font-grotesk"
          />

          <button
            type="submit"
            className="bg-green-800 text-white font-grotesk font-semibold rounded-full py-3 mt-4 hover:bg-green-700 transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputDetails;
