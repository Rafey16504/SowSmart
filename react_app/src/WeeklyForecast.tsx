import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface DailyForecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

const WeeklyForecast: FC = () => {
  const location = useLocation();
  const [weeklyWeather, setWeeklyWeather] = useState<DailyForecast[]>([]);

  useEffect(() => {
    if (location.state && location.state.weeklyWeather) {
      setWeeklyWeather(location.state.weeklyWeather);
    }
  }, [location.state]);

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

  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center bg-green-700 p-4 w-full">
        <h1 className="text-white text-5xl font-semibold">Weekly Forecast</h1>
      </div>

      <main className="flex-grow py-10 w-full max-w-4xl">
        <div className="px-4 flex flex-col items-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">7-Day Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {weeklyWeather.map((day, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-700">
                  {getDayOfWeek(day.date)}, {day.date}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="weather icon"
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-gray-700">
                  {day.temp}°C - {day.description}
                </p>
                <p className="text-gray-500">Sunrise: {day.sunrise} | Sunset: {day.sunset}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white w-full">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WeeklyForecast;
