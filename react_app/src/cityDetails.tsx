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

  const { name, gender, dob, phoneNumber, email, password } =
    location.state || {};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !name ||
      !gender ||
      !dob ||
      !phoneNumber ||
      !email ||
      !password ||
      !selectedProvince ||
      !city ||
      !district
    ) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/register-farmer", {
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
      }, 1500);
    } catch (error) {
      console.error("Error registering farmer:", error);
      setErrorMessage(
        "There was an error registering the farmer. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-lg w-full bg-white p-10 flex flex-col space-y-10">
        <h2 className="text-4xl font-extrabold font-grotesk text-green-800 text-center">
          Area Details
        </h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center font-grotesk">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-center font-grotesk">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-10 font-grotesk"
        >
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2"
            required
          >
            <option value="" disabled>
              Select Province
            </option>
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
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2"
            required
          />

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2"
            required
          />

          <button
            type="submit"
            className="bg-green-800 text-white font-semibold rounded-full py-3 hover:bg-green-700 transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default CityDetails;
