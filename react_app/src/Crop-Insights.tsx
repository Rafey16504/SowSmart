import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BASE_URL = "https://sowsmart.onrender.com/"


const shadesOfGreen = [
  "#2E8B57",
  "#66CDAA",
  "#3CB371",
  "#8FBC8F",
  "#228B22",
  "#ADFF2F",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CropInsights() {
  const [cropOptions, setCropOptions] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [chartData, setChartData] = useState<{ year: number; value: number }[]>(
    []
  );
  const [volatility, setVolatility] = useState("");
  const [forecast3Y, setForecast3Y] = useState<number[]>([]);
  const [forecastLabels, setForecastLabels] = useState<number[]>([]);

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [topCrops, setTopCrops] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    axios.get(`${BASE_URL}crop-options`).then((res) => {
      setCropOptions(res.data.crops);
      setSelectedCrop(res.data.crops[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedCrop) return;
    axios
      .get(`${BASE_URL}crop-insights`, {
        params: { crop: selectedCrop },
      })
      .then((res) => {
        setChartData(res.data.chartData);
        setVolatility(res.data.volatility);
        setForecast3Y(res.data.forecast3Y);
        setForecastLabels(res.data.forecastLabels);
      })
      .catch(() => {
        setChartData([]);
        setVolatility("");
        setForecast3Y([]);
        setForecastLabels([]);
      });
  }, [selectedCrop]);

  useEffect(() => {
    if (!selectedMonth) return;
    axios
      .get(`${BASE_URL}monthly-top-crops`, {
        params: { month: selectedMonth },
      })
      .then((res) => setTopCrops(res.data.topCrops))
      .catch(() => setTopCrops([]));
  }, [selectedMonth]);

  const formatRs = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num) ? "N/A" : `Rs ${num}`;
  };

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden bg-[#FFE0CC]">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-green-200 z-0" />
      <div className="absolute inset-0 from-green-400/40 via-white/0 to-green-600/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative  px-4 sm:px-8 flex justify-center w-full animate-fade-in">
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

      <main className="relative px-4 max-w-6xl mx-auto animate-fade-in delay-75 -mt-6 space-y-6">
        <h1 className="text-black text-5xl md:text-5xl font-bold text-center underline animate-slide-up">
          Crop Insights
        </h1>
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-lg text-gray-700">
            Select Crop:
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="p-3 border border-green-400 rounded-lg w-full sm:w-64 shadow"
          >
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {chartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              📅 Price Trends (Annual average in Rs/tonne)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(val: any) => formatRs(val)} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4CAF50"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 text-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                🔮 Price Prediction Summary
              </h3>
              <p>
                <strong>Year-to-Year Volatility:</strong> {formatRs(volatility)}
              </p>
              <p className="mt-2">
                <strong>Predicted Prices:</strong>
              </p>
              <ul className="ml-6 list-disc">
                {forecast3Y.map((val, i) => (
                  <li key={i}>
                    {forecastLabels[i]}: {formatRs(val)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 italic text-gray-600">
                Note: These prices reflect average yearly values in local
                currency units per tonne.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 text-lg bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            🛒 Best Selling Crops of {selectedMonth}
          </h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mb-4 p-2 border border-green-400 rounded"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {topCrops.length > 0 ? (
            <div className="w-full h-[400px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCrops}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                  >
                    {topCrops.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={shadesOfGreen[index % shadesOfGreen.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>No data available for selected month.</p>
          )}
        </div>
      </main>

      <footer className="relative p-4 text-center text-black w-full z-10 mt-10">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
}
