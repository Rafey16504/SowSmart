import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

    if (!farmerName || !gender || !dob || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    if (phoneNumber.length > 11) {
      setErrorMessage("Phone number should not be more than 11 digits.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
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

      setSuccessMessage("Registration successful! Redirecting to city details.");
    } catch (error) {
      console.error("Error registering farmer:", error);
      setErrorMessage("There was an error registering the farmer. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      <div className="w-11/12 max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">
          Farmer Registration
        </h2>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-center mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Farmer Name"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="w-full p-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputDetails;
