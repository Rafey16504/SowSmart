import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const InputDetails = () => {
  const [farmerName, setFarmerName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!farmerName || !gender || !dob || !phoneNumber) {
      alert("Please complete all fields before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/register-farmer",
        {
          name: farmerName,
          gender: gender,
          dateOfBirth: dob,
          phoneNumber: phoneNumber,
          email: email,
        }
      );

      navigate("/city-details", {
        state: { farmerId: response.data.farmerId },
      });
    } catch (error) {
      console.error("Error registering farmer:", error);
      alert("There was an error registering the farmer. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      <div className="w-11/12 max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">
          Farmer Registration
        </h2>

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
