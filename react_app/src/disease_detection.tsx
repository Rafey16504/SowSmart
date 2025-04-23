import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Grid } from "ldrs/react";

const DiseaseDetection = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) return;

    setImage(uploadedImage);
    setDiagnosis(null);
    setTreatment(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await fetch("http://localhost:8000/detect-disease", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const readableName = data.disease
          .replace("___", " ")
          .replace(/_/g, " ")
          .trim();

        setDiagnosis(readableName);

        const chatbotResponse = await fetch("http://localhost:8000/ask-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `What is the recommended treatment for ${readableName} in plants?`,
          }),
        });

        const chatData = await chatbotResponse.json();

        if (chatbotResponse.ok) {
          setTreatment(chatData.reply);
        } else {
          setTreatment("Failed to fetch treatment recommendation.");
        }
      } else {
        setDiagnosis("Error");
        setTreatment("Model error. Could not diagnose.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setDiagnosis("Error");
      setTreatment("Server error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col">
      <div className="flex items-center justify-between bg-green-700 p-4 text-white rounded-b-2xl shadow-md">
        <button onClick={() => navigate(-1)} className="text-white text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center w-full -ml-6">
          Disease Detection
        </h1>
      </div>

      <main className="flex-grow py-10 w-full max-w-4xl mx-auto">
        <div className="px-4 flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg mb-8 w-full text-center shadow-lg">
            <p className="text-3xl font-semibold text-gray-800 mb-4">
              Upload Your Plant Image
            </p>

            <input
              type="file"
              onChange={handleImageUpload}
              className="mb-4 p-2 border border-gray-300 rounded-lg"
              aria-label="Upload plant image"
            />

            {image && (
              <p className="text-gray-600 mb-4">
                Image uploaded: {image.name}
              </p>
            )}

            {diagnosis && (
              <div className="bg-yellow-100 p-6 rounded-lg shadow-lg w-full mb-6 text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Diagnosis:
                </h3>
                <p className="text-lg text-gray-800 mb-4 text-center">
                  <strong>Disease:</strong> {diagnosis}
                </p>
                <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
                  Treatment Recommendations:
                </h4>
                {loading ? (
                  <div className="flex justify-center">
                    <Grid size="60" speed="1" color="black" />
                  </div>
                ) : treatment ? (
                  <div className="prose max-w-full">
                    <ReactMarkdown>{treatment}</ReactMarkdown>
                  </div>
                ) : null}
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
};

export default DiseaseDetection;
