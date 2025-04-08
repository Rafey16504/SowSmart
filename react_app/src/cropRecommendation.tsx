import { useState } from "react";
import axios from "axios";

const CropRecommendation = () => {
  const [soilType, setSoilType] = useState("");
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [avgHumidity, setAvgHumidity] = useState<number | null>(null);
  const [avgRainfall, setAvgRainfall] = useState<number | null>(null);

  const soilPhMap: Record<string, [number, number]> = {
    sandy: [5.5, 6.0],
    loamy: [6.0, 7.0],
    clay: [7.0, 8.0],
    alluvial: [6.5, 8.4],
    mountain: [5.5, 7.5],
    desert: [7.5, 8.5],
    sierozem: [7.8, 8.6],
    redloamy: [6.0, 7.5],
    saline: [8.5, 10.0],
  };

  const handleSoilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSoilType(e.target.value);
    setRecommendation(null);
  };
  const fetchAverages = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return false;
    }
  
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const response = await axios.post(
            "http://localhost:8000/get-weather-average",
            { latitude, longitude }
          );
  
          const data = response.data;
  
          if (response) {
            setAvgTemp(data.averages.temperature);
            setAvgHumidity(data.averages.humidity);
            setAvgRainfall(data.averages.rainfall);
            resolve(true);
          } else {
            console.error("Failed to fetch weather averages.");
            resolve(false);
          }
        } catch (error) {
          console.error("Error fetching weather averages:", error);
          resolve(false);
        }
      });
    });
  };
  
  const handleSubmit = async () => {
    if (!soilType) {
      alert("Please select soil type first.");
      return;
    }
  
    const fetched = await fetchAverages();
  
    if (!fetched) {
      alert("Failed to fetch weather data.");
      return;
    }
  
    if (
      avgTemp === null ||
      avgHumidity === null ||
      avgRainfall === null
    ) {
      alert("Weather data is incomplete.");
      return;
    }
  
    const phRange = soilPhMap[soilType];
    const avgPh = (phRange[0] + phRange[1]) / 2;
  
    try {
      const response = await axios.post(
        "http://localhost:8000/crop-recommendation",
        {
          soilType,
          temperature: avgTemp,
          humidity: avgHumidity,
          rainfall: avgRainfall,
          ph: avgPh,
        }
      );
  
      const data = response.data;
      setRecommendation(data.recommendation || "No recommendation found.");
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };
  
  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center bg-green-700 p-4 w-full">
        <h1 className="text-white text-5xl font-semibold">
          Crop Recommendation
        </h1>
      </div>

      <main className="flex-grow py-10 w-full max-w-xl">
        <div className="px-4">
          <label
            htmlFor="soilType"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Select Soil Type:
          </label>
          <select
            id="soilType"
            value={soilType}
            onChange={handleSoilChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
          >
            <option value="">-- Choose Soil Type --</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="clay">Clay</option>
            <option value="alluvial">Alluvial</option>
            <option value="mountain">Mountain</option>
            <option value="desert">Desert</option>
            <option value="sierozem">Sierozem</option>
            <option value="redloamy">Red Loamy</option>
            <option value="saline">Saline/Alkali</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={!soilType}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Get Recommendation
          </button>

          {recommendation && (
            <div className="mt-6 text-gray-800 text-lg bg-white p-4 rounded shadow">
              <p>
                Recommended crops for{" "}
                <span className="font-bold capitalize">{soilType}</span> soil:
              </p>
              <p className="mt-2">{recommendation}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white w-full">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CropRecommendation;
