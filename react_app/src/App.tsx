import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './App.css';
function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div
        className="w-full h-full bg-gradient-to-b from-green-300 via-white flex items-center justify-center">
          <p className="text-center">
              No account?{" "}
              <Link to="/signup" className="underline hover:text-blue-500">
                Sign up
              </Link>
            </p>  
      </div>
    </div>
  );
}

export default App;
