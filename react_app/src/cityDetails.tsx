import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CityDetails = () => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const farmerId = location.state?.farmerId;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // console.log({ province, city, district });

  //   navigate("/next-page"); // Change this to the actual next page route
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register-location", {
        farmer_id: farmerId,
        province: province,
        city: city,
        district: district,
      });

      console.log("Location Registered");
      navigate("/next-page"); // Redirect to next page after submission
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      <div className="w-11/12 max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">City Details</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
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
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default CityDetails;
