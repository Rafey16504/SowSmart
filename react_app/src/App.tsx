import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Location {
  latitude: number;
  longitude: number;
}

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
  const [location, setLocation] = useState<Location | null>(null);
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [weeklyWeather, setWeeklyWeather] = useState<DailyForecast[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to retrieve location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
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
      console.log(data);

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
        setError("Failed to fetch weather data.");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to fetch weather data.");
    }
  };

  const handleWeatherContainerClick = () => {
    navigate("/weekly-forecast", { state: { weeklyWeather } });
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
  const handleCropRecommendationClick = () => {
    navigate("/crop-recommendation");
  };
  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center bg-green-700 p-4 w-full">
        <h1 className="text-white text-5xl font-semibold">SowSmart</h1>
      </div>

      <main className="flex-grow py-10 w-full max-w-4xl">
        <div className="px-4 flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg mb-8 w-full">
            <p className="text-3xl font-semibold text-gray-800 mb-4 text-center">Welcome to SowSmart</p>
            <p className="text-lg text-gray-600 mb-6 text-center">Manage your smart farming solutions with ease!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={handleWeatherContainerClick}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Weather</h3>
              <p className="text-gray-600">
                {currentWeather ? (
                  <div>
                    <div className="text-gray-700">
                      <span className="font-bold">{currentDay}</span>, {currentDate.toLocaleDateString()}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-bold">Temperature:</span> {currentWeather.temperature}°C
                    </div>
                    <div className="text-gray-700">
                      <span className="font-bold">Condition:</span> {currentWeather.description}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-bold">Humidity:</span> {currentWeather.humidity}%
                    </div>
                    <div className="text-gray-700">
                      <span className="font-bold">Wind Speed:</span> {currentWeather.windSpeed} m/s
                    </div>
                    <img src={currentWeather.icon} alt="weather icon" className="w-12 h-12" />
                  </div>
                ) : (
                  "Fetching weather..."
                )}
              </p>
            </div>
            <div
  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
  onClick={handleCropRecommendationClick}
>
  <h3 className="text-xl font-semibold text-gray-800 mb-3">Crop Recommendation</h3>
  <p className="text-gray-600">
    Get personalized crop suggestions based on your soil type.
  </p>
</div>
            {alerts.length > 0 && (
              <div className="bg-red-100 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Weather Alerts</h3>
                {alerts.map((alert, index) => (
                  <div key={index} className="text-gray-700 mb-4">
                    <h4 className="font-bold">{alert.event}</h4>
                    <p>{alert.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white w-full">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
