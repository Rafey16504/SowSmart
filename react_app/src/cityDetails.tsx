import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CityDetails = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const {
    name,
    gender,
    dob,
    phoneNumber,
    email,
    password,
  } = location.state || {};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !name || !gender || !dob || !phoneNumber || !email || !password ||
      !selectedProvince || !city || !district
    ) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register-farmer", {
        name,
        gender,
        dateOfBirth: dob,
        phoneNumber,
        email,
        password,
        province: selectedProvince,
        city,
        district,
      });

      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error registering farmer:", error);
      setErrorMessage("There was an error registering the farmer. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-green-50 h-screen">
      <div className="max-w-md w-11/12 bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">
          City Details
        </h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>Select Province</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
            <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
          </select>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
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

export default CityDetails;
