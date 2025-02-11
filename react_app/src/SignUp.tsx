import React from "react";
import { Link } from "react-router-dom";


const SignUp = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      

      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        {/* **UniServe Title** */}
        <div className="text-center -mt-16">
          <h1 className="font-grotesk font-extrabold text-6xl text-green-800">
            SowSmart
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">
            Welcome
          </p>
          <p className="font-grotesk text-lg text-green-600">
            Sign Up
          </p>
        </div>

        {/* Input Fields */}
        <div className="w-3/4 flex flex-col items-center space-y-12">
          <input
            type="text"
            placeholder="Mobile Number"
            className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2 font-grotesk"
          />
        </div>

        {/* Sign In Button */}
        <Link
          to="/"
          className="bg-green-800 rounded-full px-16 py-3 text-white font-semibold text-lg w-3/4 text-center font-grotesk"
        >
          Sign Up
        </Link>

        
      </div>
    </div>
  );
};

export default SignUp;
