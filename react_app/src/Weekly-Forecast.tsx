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
    <div className="relative min-h-screen font-grotesk overflow-hidden scroll-smooth">
      <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-white to-green-200 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200/40 via-white/0 to-green-100/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative bg-green-700 py-6 px-4 sm:px-8 rounded-b-3xl shadow-lg z-10 flex justify-center">
        <a
          href="/home"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-green-200 transition"
          title="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 md:w-8 md:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </a>
        <h1 className="text-white text-4xl sm:text-5xl font-bold drop-shadow-md">
          Weekly Forecast
        </h1>
      </header>

      <main className="relative z-10 flex-grow py-10 w-full max-w-6xl mx-auto px-4 animate-fade-up">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
          7-Day Outlook
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyWeather.map((day, index) => (
            <div
              key={index}
              className={`bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center border border-green-200 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
            >
              <p className="text-lg font-semibold text-green-800 mb-1">
                {getDayOfWeek(day.date)},{" "}
                {new Date(day.date).toLocaleDateString()}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt="weather icon"
                className="w-16 h-16 mx-auto mb-2"
                loading="lazy"
              />
              <p className="text-gray-700 mb-1 text-lg">
                {day.temp}°C - {day.description}
              </p>
              <p className="text-gray-500 text-sm">
                🌅 {day.sunrise} &nbsp; | &nbsp; 🌇 {day.sunset}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative bg-gray-900 py-4 text-center text-white text-sm z-10 rounded-t-3xl animate-fade-in">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WeeklyForecast;
