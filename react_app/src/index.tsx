import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import App from "./App";
import SignUp from "./SignUp";
import AnimatedRoute from "./AnimatedRoute";
import reportWebVitals from "./reportWebVitals";
import InputDetails from "./inputDetails";


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


        <Route
        path="/input-details"
        element={
          <AnimatedRoute>
            <InputDetails />
          </AnimatedRoute>
        }
      />


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