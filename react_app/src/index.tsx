import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import SignUp from "./SignUp";
import AnimatedRoute from "./AnimatedRoute";
import reportWebVitals from "./reportWebVitals";
import InputDetails from "./inputDetails";
import CityDetails from "./cityDetails";
import SignIn from "./SignIn";
import WeeklyForecast from "./WeeklyForecast";
import CropRecommendation from "./cropRecommendation";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route
        path="/signin"
        element={
          <AnimatedRoute>
            <SignIn />
          </AnimatedRoute>
        }
      />
      <Route
        path="/app"
        element={
          <AnimatedRoute>
            <App />
          </AnimatedRoute>
        }
      />
      <Route
        path="/weekly-forecast"
        element={
          <AnimatedRoute>
            <WeeklyForecast />
          </AnimatedRoute>
        }
      />
      <Route
        path="/crop-recommendation"
        element={
          <AnimatedRoute>
            <CropRecommendation />
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
      <Route path="/city-details" element={<CityDetails />} />
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
