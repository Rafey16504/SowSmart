import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import App from "./App";
import SignUp from "./SignUp";
import AnimatedRoute from "./AnimatedRoute";
import reportWebVitals from "./reportWebVitals";
import InputDetails from "./inputDetails";
<<<<<<< HEAD
import CityDetails from "./cityDetails";
=======
>>>>>>> d38098b3eff49a93b610aad2f1104e62178e8780


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <AnimatedRoute>
            <App />
          </AnimatedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AnimatedRoute>
            <SignUp />
          </AnimatedRoute>
        }
      />
<<<<<<< HEAD
      <Route
     path="/input-details"
     element={
    <AnimatedRoute>
      <InputDetails />
    </AnimatedRoute>
  }
/>

    <Route
      path="/city-details"
      element={<CityDetails />}
    />
=======


  

>>>>>>> d38098b3eff49a93b610aad2f1104e62178e8780

    </Routes>
  );
};

root.render(
  <React.StrictMode>
    <Router>
      <AnimatedRoutes />
    </Router>
  </React.StrictMode>
);

reportWebVitals();