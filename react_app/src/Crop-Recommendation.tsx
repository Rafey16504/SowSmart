import { useState } from "react";
import axios from "axios";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

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
  const [recommendation, setRecommendation] = useState<
    string[] | string | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSoilSelection = (soil: string) => {
    setSoilType(soil);
    setRecommendation(null);
    setSubmitted(false);
  };

  const handleReset = () => {
    setSoilType("");
    setRecommendation(null);
    setSubmitted(false);
  };

  const fetchWeatherAverages = async (): Promise<{
    temp: number;
    humidity: number;
    rainfall: number;
  } | null> => {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            "http://localhost:8000/get-weather-average",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            resolve({
              temp: data.averages.temperature,
              humidity: data.averages.humidity,
              rainfall: data.averages.rainfall,
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          resolve(null);
        }
      });
    });
  };

  const handleSubmit = async () => {
    if (!soilType) {
      return;
    }

    setRecommendation(null);
    setSubmitted(true);
    setLoading(true);

    const averages = await fetchWeatherAverages();
    if (!averages) {
      setLoading(false);
      setSubmitted(false);
      return;
    }

    const [phMin, phMax] = soilPhMap[soilType];
    const avgPh = (phMin + phMax) / 2;

    try {
      const response = await axios.post(
        "http://localhost:8000/crop-recommendation",
        {
          soilType,
          temperature: averages.temp,
          humidity: averages.humidity,
          rainfall: averages.rainfall,
          ph: avgPh,
        }
      );

      const data = response.data;
      setRecommendation(data.recommendation || "No recommendation found.");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-grotesk min-h-screen flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50 via-white to-green-100 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-200/40 via-white/0 to-green-300/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative bg-green-700 py-6 px-4 sm:px-8 rounded-b-3xl shadow-lg z-10 flex justify-center w-full animate-fade-in">
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
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
          Crop Recommendation
        </h1>
      </header>

      <main className="flex-grow py-10 w-full max-w-5xl px-4 relative z-10">
        {!submitted && !loading && (
          <div className="bg-white border-l-8 border-green-600 shadow-xl rounded-xl p-6 mb-10 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🌾 Know Before You Sow
            </h2>
            <p className="text-gray-700 text-lg">
              Discover the best crops for your soil and climate, powered by
              smart weather insights. Just pick your soil type and let us guide
              your harvest.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center min-h-[60vh] w-full text-center mt-auto">
            <div className="flex flex-col items-center">
              <Quantum size="60" speed="2" color="black" />
              <div className="mt-6 text-green-700 font-medium text-lg">
                <p>Harvesting Recommendations for</p>
                <p className="capitalize">{soilType} Soil</p>
              </div>
            </div>
          </div>
        )}

        {!submitted && !loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fade-in delay-100">
              {Object.keys(soilPhMap).map((soil) => (
                <div
                  key={soil}
                  onClick={() => handleSoilSelection(soil)}
                  className={`relative cursor-pointer border-4 rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105 hover:shadow-lg ${
                    soilType === soil
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={`/${soil}.jpg`}
                    alt={`${soil} soil`}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-black/50 text-white text-center py-2 text-sm font-semibold capitalize">
                    {soil.replace(/([A-Z])/g, " $1")}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={!soilType || loading}
                className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-medium hover:bg-green-700 transition disabled:opacity-50 shadow-lg"
              >
                Get Recommendation
              </button>
            </div>
          </>
        )}

        {recommendation && !loading && (
          <div className="mt-10 text-gray-800 p-8 rounded-3xl max-w-2xl mx-auto animate-fade-in bg-white shadow-lg">
            <div className="flex items-center justify-center gap-4 mb-6 text-center">
              <span className="text-green-700 text-3xl">🌱</span>
              <div>
                <h3 className="text-2xl font-bold text-green-800">
                  Best Crops for
                </h3>
                <p className="text-xl font-semibold text-green-800 capitalize">
                  {soilType} Soil
                </p>
              </div>
            </div>

            <div className="flex flex-col flex-wrap items-center gap-3 mt-6 space-y-2">
              {(Array.isArray(recommendation)
                ? recommendation
                : [recommendation]
              ).map((crop, index) => (
                <span
                  key={index}
                  className="px-10 py-2 rounded-full text-green-800 font-semibold shadow-sm border border-green-300 bg-white transform transition-transform duration-200 hover:scale-150"
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </span>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-orange-950 border border-gray-300 hover:border-green-500 text-white hover:text-green-700 hover:bg-green-100 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                🔄 Choose Another Soil Type
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="relative bg-gray-800 p-4 text-center text-white w-full rounded-t-3xl z-10">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CropRecommendation;
