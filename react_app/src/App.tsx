import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

const BASE_URL = "https://sowsmart.onrender.com/"


interface Weather {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}
interface DailyForecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}
interface Alert {
  event: string;
  description: string;
  start: number;
  end: number;
}

function App() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [weeklyWeather, setWeeklyWeather] = useState<DailyForecast[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          fetchWeather(latitude, longitude),
        () => setMessage("Unable to retrieve location.")
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`${BASE_URL}/get-weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();

      setCurrentWeather({
        temperature: data.current.temperature,
        description: data.current.description,
        icon: `https://openweathermap.org/img/wn/${data.current.icon}@2x.png`,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
      });
      setWeeklyWeather(data.weekly);
      setAlerts(data.alerts || []);
    } catch {
      setMessage("Failed to fetch weather data.");
    }
  };

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden bg-[#FFE0CC]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-green-200 z-0" />
      <div className="absolute inset-0 from-green-400/40 via-white/0 to-green-600/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative flex justify-center items-center z-10">
        <img
          src="/SowSmart-logo1.png"
          alt="SowSmart Logo"
          className="h-64 object-contain drop-shadow-md"
        />
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 right-6 text-green-800 hover:text-red-400 transition"
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>
      </header>

      {message && (
        <p className="text-center text-green-700 z-10 mt-4">{message}</p>
      )}

      <main className="relative flex-grow px-6 flex flex-col items-center justify-center gap-12 z-10 -mt-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {currentWeather ? (
            <div
              onClick={() =>
                navigate("/weekly-forecast", { state: { weeklyWeather } })
              }
              className="cursor-pointer p-6 rounded-2xl shadow-mdhover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center space-y-2"
            >
              <h2 className="text-xl font-semibold mb-2 text-green-700 self-start">
                Current Weather
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={currentWeather.icon}
                  alt="weather icon"
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentWeather.temperature}°C
                  </p>
                  <p className="capitalize text-gray-600">
                    {currentWeather.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-md text-gray-600 space-y-1 flex flex-col justify-center items-center ">
                <p>💧 Humidity: {currentWeather.humidity}%</p>
                <p>🌬️ Wind: {currentWeather.windSpeed} km/h</p>
              </div>
              <p className="text-green-600 underline self-start">
                Tap to view weekly forecast →
              </p>
            </div>
          ) : !message ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Grid size="80" speed="1" color="black" />
              <p className="text-gray-700 font-medium text-center">
                Fetching your local weather data...
              </p>
            </div>
          ) : null}

          {alerts.length > 0 && (
            <section className="w-full max-w-4xl p-6 rounded-xl bg-red-50 border border-red-300 shadow-md mt-10">
              <h3 className="text-xl font-semibold text-red-700 mb-3">
                🚨 Weather Alerts
              </h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="text-red-800">
                    <strong>{alert.event}</strong>
                    <p>{alert.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div
            onClick={() => navigate("/crop-recommendation")}
            className="relative cursor-pointer w-full h-64 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <img
              src="/crop-rec.jpg"
              alt="Crop Recommendation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">
                Crop Recommendation
              </h3>
            </div>
          </div>

          <div
            onClick={() => navigate("/crop-insights")}
            className="relative cursor-pointer w-full h-64 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <img
              src="/crop-insights1.jpg"
              alt="Crop Insights"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">
                Crop Insights
              </h3>
            </div>
          </div>

          <div
            onClick={() => navigate("/ai-chat")}
            className="relative cursor-pointer w-full h-64 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <img
              src="/ai-chat.jpg"
              alt="Disease Detection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">CropMind</h3>
            </div>
          </div>

          <div
            onClick={() => navigate("/disease-detection")}
            className="relative cursor-pointer w-full h-64 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <img
              src="/disease-detection.jpg"
              alt="Disease Detection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl font-semibold">
                Disease Detection
              </h3>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative py-4 text-center text-black text-sm z-10 rounded-t-3xl">
        <p>&copy; {new Date().getFullYear()} SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
