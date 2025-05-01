import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { provinceCitiesMap, Province } from "./provinceCities";

const CityDetails = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | "">("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { name, gender, dob, phoneNumber, email, password } =
    location.state || {};

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value as Province;
    setSelectedProvince(province);
    setCity("");
    setDistrict("");
    setAvailableCities(provinceCitiesMap[province] || []);
  };

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
      await axios.post("https://sowsmart.onrender.com/register-farmer", {
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
      setErrorMessage(
        "There was an error registering the farmer. Please try again."
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
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
            onChange={handleProvinceChange}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2"
            required
          >
            <option value="" disabled>
              Select Province
            </option>
            {Object.keys(provinceCitiesMap).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-500 pb-2"
            required
            disabled={!selectedProvince}
          >
            <option value="" disabled>
              Select City
            </option>
            {availableCities.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Town/Area"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            onKeyDown={handleKeyDown}
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