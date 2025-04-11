import { useState } from "react";
import axios from "axios";

const soilPhMap: Record<string, [number, number]> = {
  sandy: [5.5, 6.0],
  loamy: [6.0, 7.0],
  clay: [7.0, 8.0],
  alluvial: [6.5, 8.4],
  mountain: [5.5, 7.5],
  desert: [7.5, 8.5],
  sierozem: [7.8, 8.6],
  redLoamy: [6.0, 7.5],
};

const CropRecommendation = () => {
  const [soilType, setSoilType] = useState("");
  const [recommendation, setRecommendation] = useState<string[] | string | null>(null);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [avgHumidity, setAvgHumidity] = useState<number | null>(null);
  const [avgRainfall, setAvgRainfall] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSoilSelection = (soil: string) => {
    setSoilType(soil);
    setRecommendation(null);
    setErrorMessage(null);
  };

  const fetchWeatherAverages = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch("http://localhost:8000/get-weather-average", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await response.json();

          if (response.ok) {
            setAvgTemp(data.averages.temperature);
            setAvgHumidity(data.averages.humidity);
            setAvgRainfall(data.averages.rainfall);
            resolve(true);
          } else {
            setErrorMessage("Failed to fetch weather averages.");
            resolve(false);
          }
        } catch (error) {
          console.error("Error fetching weather averages:", error);
          setErrorMessage("Error fetching weather averages.");
          resolve(false);
        }
      });
    });
  };

  const handleSubmit = async () => {
    if (!soilType) {
      setErrorMessage("Please select soil type first.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setRecommendation(null);

    const fetched = await fetchWeatherAverages();

    if (!fetched || avgTemp === null || avgHumidity === null || avgRainfall === null) {
      setErrorMessage("Failed to get crop recommendation.");
      setLoading(false);
      return;
    }

    const [phMin, phMax] = soilPhMap[soilType];
    const avgPh = (phMin + phMax) / 2;

    try {
      const response = await axios.post("http://localhost:8000/crop-recommendation", {
        soilType,
        temperature: avgTemp,
        humidity: avgHumidity,
        rainfall: avgRainfall,
        ph: avgPh,
      });

      const data = response.data;
      setRecommendation(data.recommendation || "No recommendation found.");
      setSuccessMessage("Crop recommendation fetched successfully.");
    } catch (error) {
      console.error("Error fetching crop recommendation:", error);
      setErrorMessage("Error fetching crop recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessages = () => (
    <>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md text-center mb-4">
          {successMessage}
        </div>
      )}
      {loading && (
        <p className="mt-4 text-center text-green-700 font-medium animate-pulse">
          Please wait while we fetch your crop recommendation...
        </p>
      )}
    </>
  );

  const renderSoilOptions = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Object.keys(soilPhMap).map((soil) => (
        <div
          key={soil}
          onClick={() => handleSoilSelection(soil)}
          className={`cursor-pointer border-4 rounded-lg overflow-hidden transition hover:scale-105 ${
            soilType === soil ? "border-green-500" : "border-transparent"
          }`}
        >
          <img
            src={`/${soil}.jpg`}
            alt={`${soil} soil`}
            className="w-full h-32 object-cover"
          />
          <div className="text-center font-medium py-2 capitalize bg-white">
            {soil}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecommendation = () =>
    recommendation && (
      <div className="mt-6 text-gray-800 text-lg bg-white p-4 rounded shadow">
        <p>
          Recommended crops for{" "}
          <span className="font-bold capitalize">{soilType}</span> soil:
        </p>
        <ul className="mt-2 list-disc list-inside">
          {(Array.isArray(recommendation) ? recommendation : [recommendation]).map(
            (crop, index) => (
              <li key={index}>{crop}</li>
            )
          )}
        </ul>
      </div>
    );

  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <header className="flex justify-center bg-green-700 p-4 w-full">
        <h1 className="text-white text-5xl font-semibold">Crop Recommendation</h1>
      </header>

      <main className="flex-grow py-10 w-full max-w-4xl px-4">
        <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
          Select Soil Type:
        </h2>

        {renderMessages()}
        {renderSoilOptions()}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={!soilType || loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Get Recommendation"}
          </button>
        </div>

        {renderRecommendation()}
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white w-full">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CropRecommendation;
