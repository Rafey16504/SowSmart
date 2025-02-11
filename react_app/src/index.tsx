// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import App from "./App";
import SignUp from "./SignUp";
import AnimatedRoute from "./AnimatedRoute"; // Import the new component
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Create a wrapper component to pass the location to AnimatePresence
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