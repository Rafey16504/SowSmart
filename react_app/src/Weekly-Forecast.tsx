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
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden bg-[#FFE0CC]">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-green-200 z-0" />
      <div className="absolute inset-0 from-green-400/40 via-white/0 to-green-600/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative px-4 sm:px-8 flex justify-center w-full animate-fade-in">
        <a
          href="/home"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-black bg-green-300/80 rounded-full p-1  hover:text-green-200 transition"
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
        <img
          src="/SowSmart-logo-notext.png"
          alt="SowSmart Logo"
          className="w-40 h-40 object-cover"
        />
      </header>

      <main className="relative z-10 flex-grow w-full max-w-6xl mx-auto px-4 animate-fade-up space-y-8 -mt-6">
      <h1 className="text-black text-5xl md:text-5xl font-bold text-center underline animate-slide-up">
          Weekly Forecast
        </h1>
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

      <footer className="relative py-4 text-center text-black text-sm z-10 animate-fade-in">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WeeklyForecast;
