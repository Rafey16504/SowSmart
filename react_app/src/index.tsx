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
import SignUp from "./Sign-Up";
import AnimatedRoute from "./AnimatedRoute";
import reportWebVitals from "./reportWebVitals";
import InputDetails from "./Input-Details";
import CityDetails from "./City-Details";
import SignIn from "./Sign-In";
import WeeklyForecast from "./Weekly-Forecast";
import CropRecommendation from "./Crop-Recommendation";
import AIChatPage from "./AI-Chat";
import DiseaseDetection from "./Disease-Detection";
import CropInsights from "./Crop-Insights";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<AnimatedRoute><SignIn /></AnimatedRoute>} />
      <Route path="/home" element={<AnimatedRoute><App /></AnimatedRoute>} />
      <Route path="/ai-chat" element={<AnimatedRoute><AIChatPage /></AnimatedRoute>} />
      <Route path="/weekly-forecast" element={<AnimatedRoute><WeeklyForecast /></AnimatedRoute>} />
      <Route path="/crop-recommendation" element={<AnimatedRoute><CropRecommendation /></AnimatedRoute>} />
      <Route path="/disease-detection" element={<AnimatedRoute><DiseaseDetection /></AnimatedRoute>} />
      <Route path="/crop-insights" element={<AnimatedRoute><CropInsights /></AnimatedRoute>} />
      <Route path="/signup" element={<AnimatedRoute><SignUp /></AnimatedRoute>} />
      <Route path="/input-details" element={<AnimatedRoute><InputDetails /></AnimatedRoute>} />
      <Route path="/city-details" element={<AnimatedRoute><CityDetails /></AnimatedRoute>} />
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
