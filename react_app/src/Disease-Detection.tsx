import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Grid } from "ldrs/react";
import dotenv from "dotenv";

dotenv.config();

const DiseaseDetection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) return;

    setImage(uploadedImage);
    setPreviewUrl(URL.createObjectURL(uploadedImage));
    setDiagnosis(null);
    setTreatment(null);
  };

  const diagnoseDisease = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.BASE_URL}/detect-disease`, {
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

        const chatbotResponse = await fetch(`${process.env.BASE_URL}/ask-ai`, {
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
        const fallbackForm = new FormData();
        fallbackForm.append(
          "message",
          "Please identify the plant disease from this image. Add emojis and reply in a markdown format. Give detailed treatment or prevention tips."
        );
        fallbackForm.append("image", image);

        const fallbackResponse = await fetch(`${process.env.BASE_URL}/ask-ai`, {
          method: "POST",
          body: fallbackForm,
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
          setDiagnosis("AI-based diagnosis");
          setTreatment(fallbackData.reply);
        } else {
          setDiagnosis("Unknown");
          setTreatment("Could not retrieve any diagnosis. Please try again.");
        }
      }
    } catch (error) {
          setDiagnosis("Error while getting diagnosis.");
          setTreatment("Could not retrieve any diagnosis. Please try again after some time.");
    }

    setLoading(false);
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

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 z-10 animate-fade-in">
      <h1 className="text-black text-5xl md:text-5xl font-bold text-center underline animate-slide-up">
          Disease Detection
        </h1>
        <div className="flex flex-col items-center">
          <div className=" p-8 mb-8 w-full text-center animate-zoom-in">
            <p className="text-3xl font-semibold text-gray-800 mb-4">
              Upload Your Plant Image
            </p>

            <input
              type="file"
              onChange={handleImageSelect}
              className="mb-4 p-2 border border-gray-300 rounded-lg"
            />

            {image && (
              <div className="flex flex-row items-center justify-center gap-4 mb-4 animate-fade-in delay-100">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="w-64 h-auto rounded-lg border border-gray-300 shadow animate-zoom-in"
                  />
                )}
                <button
                  onClick={diagnoseDisease}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg shadow transition-all animate-fade-in delay-200 ${
                    loading
                      ? "bg-green-600 opacity-60 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {loading ? "Diagnosing..." : "Diagnose Disease"}
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center min-h-[200px] py-6 animate-zoom-in">
                <Grid size="60" speed="1" color="black" />
              </div>
            ) : (
              diagnosis && (
                <div className="bg-green-100 p-6 rounded-lg shadow-lg w-full mb-6 text-left animate-fade-in delay-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    Diagnosis:
                  </h3>
                  <p className="text-lg text-gray-800 mb-4 text-center">
                    <strong>Disease:</strong> {diagnosis}
                  </p>
                  <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
                    Treatment Recommendations:
                  </h4>
                  {treatment ? (
                    <div className="prose max-w-full animate-fade-in delay-300">
                      <ReactMarkdown>{treatment}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">
                      No treatment found.
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <p className="text-gray-700 text-lg opacity-60">
          Note: AI responses are subject to change, and may not always be
          accurate or reliable. Always seek professional advice before making
          decisions based on AI-generated information.{" "}
        </p>
      </main>

      <footer className="p-4 text-center text-black w-full z-10">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DiseaseDetection;
