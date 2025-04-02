import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CityDetails = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const farmerId = location.state?.farmerId;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!farmerId || !selectedProvince || !city || !district) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/register-location", {
        farmerId: farmerId,
        province: selectedProvince,
        city: city,
        district: district,
      });
      navigate("/");
    } catch (error) {
      console.error("Error saving location", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-green-50 h-screen">
      <div className="max-w-md w-11/12 bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">
          City Details
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={selectedProvince}
            onChange={(event) => setSelectedProvince(event.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            onChange={(event) => setCity(event.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
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
