import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

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
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (message) => {
          setMessage("Unable to retrieve location.");
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch("http://localhost:8000/get-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentWeather({
          temperature: data.current.temperature,
          description: data.current.description,
          icon: `https://openweathermap.org/img/wn/${data.current.icon}@2x.png`,
          humidity: data.current.humidity,
          windSpeed: data.current.windSpeed,
        });

        setWeeklyWeather(data.weekly);
        setAlerts(data.alerts || []);
      } else {
        setMessage("Failed to fetch weather data.");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setMessage("Failed to fetch weather data.");
    }
  };

  const handleWeatherContainerClick = () => {
    if (currentWeather === null) return;
    navigate("/weekly-forecast", { state: { weeklyWeather } });
  };

  const handleCropRecommendationClick = () => {
    navigate("/crop-recommendation");
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  };

  const currentDate = new Date();
  const currentDay = getDayOfWeek(currentDate.toISOString());

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-200/40 via-white/0 to-green-300/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative bg-green-700 shadow-lg py-6 px-4 sm:px-8 flex justify-between items-center z-10 rounded-b-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md animate-pulse">
          🌱 SowSmart
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white text-sm sm:text-base hover:border-red-300 rounded-md px-3 py-1 transition-all"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </button>
        </div>
      </header>
      {message && (
        <div className="message font-grotesk text-green-600">{message}</div>
      )}
      <main className="relative flex-grow px-6 py-10 flex flex-col items-center justify-center gap-12 z-10">
        <section className="text-center max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
            Welcome to <span className="text-green-700">SowSmart</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your smart farming solutions interactively and efficiently.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          <div
            onClick={handleWeatherContainerClick}
            className="relative bg-gradient-to-br from-green-200 to-green-50 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-green-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Real-time Weather
            </h3>
            {currentWeather ? (
              <div className="space-y-1 text-gray-700">
                <div>
                  <strong>{currentDay}</strong>,{" "}
                  {currentDate.toLocaleDateString()}
                </div>
                <div>
                  <strong>Temperature:</strong> {currentWeather.temperature}°C
                </div>
                <div>
                  <strong>Condition:</strong> {currentWeather.description}
                </div>
                <div>
                  <strong>Humidity:</strong> {currentWeather.humidity}%
                </div>
                <div>
                  <strong>Wind Speed:</strong> {currentWeather.windSpeed} m/s
                </div>
                <img
                  src={currentWeather.icon}
                  alt="weather icon"
                  className="w-14 h-14 mt-2"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <Grid size="80" speed="1" color="black" />
              </div>
            )}
          </div>

          <div
            onClick={handleCropRecommendationClick}
            className="relative bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-yellow-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Crop Recommendation
            </h3>
            <p className="text-gray-700">
              Get personalized crop suggestions based on your soil and weather.
            </p>
          </div>
        </section>

        {alerts.length > 0 && (
          <section className="w-full max-w-4xl p-6 rounded-xl bg-red-50 border border-red-300 shadow-md">
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
      </main>

      <footer className="relative bg-gray-900 py-4 text-center text-white text-sm z-10 rounded-t-3xl">
        <p>&copy; {new Date().getFullYear()} SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
