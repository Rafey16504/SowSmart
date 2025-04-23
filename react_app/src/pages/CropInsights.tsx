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
    axios.get("http://localhost:8000/crop-options").then((res) => {
      setCropOptions(res.data.crops);
      setSelectedCrop(res.data.crops[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedCrop) return;
    axios
      .get("http://localhost:8000/crop-insights", {
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
      .get("http://localhost:8000/monthly-top-crops", {
        params: { month: selectedMonth },
      })
      .then((res) => {
        setTopCrops(res.data.topCrops);
      })
      .catch(() => {
        setTopCrops([]);
      });
  }, [selectedMonth]);

  const formatRs = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(num)
      ? "N/A"
      : `Rs ${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📊 Crop Insights</h2>

      {/* Crop Dropdown */}
      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        {cropOptions.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      {/* Crop Line Chart */}
      {chartData.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">
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
            <h3 className="text-xl font-semibold mb-2">
              🔮 Price Prediction Summary
            </h3>
            <p>
              <strong>Year-to-Year Volatility:</strong> {formatRs(volatility)}
            </p>
            <p>
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
              Note: These prices reflect average yearly values in local currency
              units per tonne.
            </p>
          </div>
        </>
      )}

      {/* Monthly Top Crops Pie Chart */}
      <div className="mt-12 text-lg">
        <h3 className="text-xl font-semibold mb-2">
          🛒 Best Selling Crops of {selectedMonth}
        </h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {topCrops.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topCrops}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={({ name, value }) =>
                  `${name} : ${value.toLocaleString()}`
                }
              >
                {topCrops.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={shadesOfGreen[index % shadesOfGreen.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for selected month.</p>
        )}
      </div>
    </div>
  );
}
