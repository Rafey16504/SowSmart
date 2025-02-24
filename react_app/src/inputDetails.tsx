import React, { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
>>>>>>> d38098b3eff49a93b610aad2f1104e62178e8780

const InputDetails = () => {
  const [farmerName, setFarmerName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

<<<<<<< HEAD
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ farmerName, gender, dob, phoneNumber });
    navigate("/city-details"); // Redirect to City Details page
  };



  
=======
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log({ farmerName, gender, dob, phoneNumber });
  // };

>>>>>>> d38098b3eff49a93b610aad2f1104e62178e8780
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      <div className="w-11/12 max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-green-800 text-center">Farmer Registration</h2>
        
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