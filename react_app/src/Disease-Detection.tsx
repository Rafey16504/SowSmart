import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Helix } from "ldrs/react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://sowsmart.onrender.com/";

const DiseaseDetection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<"precheck" | "diagnosis" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) return;

    setImage(uploadedImage);
    setPreviewUrl(URL.createObjectURL(uploadedImage));
    setDiagnosis(null);
    setTreatment(null);

    console.log("DiseaseDetection: Image selected:", uploadedImage.name);
  };

  const diagnoseDisease = async () => {
    if (!image) return;

    console.log("DiseaseDetection: Starting diagnosis...");

    setLoading(true);
    setLoadingStep("precheck");
    setDiagnosis(null);
    setTreatment(null);

    const preCheckForm = new FormData();
    preCheckForm.append(
      "message",
      "Please analyze this image and tell me if it is of a plant or a plant part. Also, is the plant healthy or unhealthy (only say its unhealthy if you see clear visible spots or infection, ignore very small details like holes and tears, also dont focus on discoloration a lot unless its clearly visible)? Reply concisely as 'plant: yes/no. health: healthy/unhealthy.'"    );
    preCheckForm.append("image", image);

    try {
      const preCheckResponse = await fetch(`${BASE_URL}ask-ai`, {
        method: "POST",
        body: preCheckForm,
      });

      const preCheckData = await preCheckResponse.json();
      const replyText = preCheckData.reply.toLowerCase();
      console.log("DiseaseDetection: Pre-check AI reply:", replyText);

      if (!replyText.includes("plant: yes")) {
        console.warn("DiseaseDetection: Image rejected — Not a plant.");
        setDiagnosis("Not a plant image");
        setTreatment("Please upload a valid image of a plant or plant part.");
        setLoading(false);
        setLoadingStep(null);
        return;
      }

      if (!replyText.includes("unhealthy")) {
        console.log("DiseaseDetection: Image validated as healthy.");
        setDiagnosis("Healthy Plant");
        setTreatment("This plant appears to be healthy. No treatment is needed.");
        setLoading(false);
        setLoadingStep(null);
        return;
      }

      console.log("DiseaseDetection: Unhealthy plant detected. Proceeding to diagnosis...");
      setLoadingStep("diagnosis");

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${BASE_URL}detect-disease`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const readableName = data.disease.replace("___", " ").replace(/_/g, " ").trim();
        console.log("DiseaseDetection: Disease identified:", readableName);

        setDiagnosis(readableName);

        const chatbotResponse = await fetch(`${BASE_URL}ask-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `What is the recommended treatment for ${readableName} in plants?`,
          }),
        });

        const chatData = await chatbotResponse.json();
        if (chatbotResponse.ok) {
          console.log("DiseaseDetection: Treatment advice received from AI.");
          console.log("DiseaseDetection: Treatment content:", chatData.reply);
          setTreatment(chatData.reply);
        } else {
          console.error("DiseaseDetection: Failed to fetch treatment from AI.");
          setTreatment("Failed to fetch treatment recommendation.");
        }
      } else {
        console.warn("DiseaseDetection: Fallback triggered. Primary diagnosis failed.");

        const fallbackForm = new FormData();
        fallbackForm.append(
          "message",
          "Please identify the plant disease from this image. Add emojis..."
        );
        fallbackForm.append("image", image);

        const fallbackResponse = await fetch(`${BASE_URL}ask-ai`, {
          method: "POST",
          body: fallbackForm,
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
          console.log("DiseaseDetection: Fallback treatment received.");
          setDiagnosis("AI-based diagnosis");
          setTreatment(fallbackData.reply);
        } else {
          console.error("DiseaseDetection: Both primary and fallback diagnosis failed.");
          setDiagnosis("Unknown");
          setTreatment("Could not retrieve any diagnosis. Please try again.");
        }
      }

      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } catch (error) {
      console.error("DiseaseDetection: Diagnosis failed due to network or server error.", error);
      setDiagnosis("Could not diagnose.");
      setTreatment("Today's limit has been reached. Please try again later.");
    }

    setLoading(false);
    setLoadingStep(null);
  };

  useEffect(() => {
    console.log("DiseaseDetection: Component mounted. Scroll to top.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden bg-[#FFE0CC]">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-green-200 z-0" />
      <div className="absolute inset-0 from-green-400/40 via-white/0 to-green-600/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative px-4 sm:px-8 flex justify-center w-full animate-fade-in">
        <a
          href="/home"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-black bg-green-300/80 rounded-full p-1 hover:text-green-200 transition"
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
          onClick={() => navigate("/home")}
        />
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 z-10 animate-fade-in">
        <h1 className="text-black text-5xl md:text-5xl font-bold text-center underline animate-slide-up">
          Disease Detection
        </h1>
        <div className="flex flex-col items-center">
          <div className="p-8 mb-8 w-full text-center animate-zoom-in">
            {!loading && (
              <>
                <div className="bg-white border-l-8 border-green-600 shadow-xl rounded-3xl p-8 mb-12 text-center animate-fade-in">
                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    Treat your plants with confidence
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Upload a photo of a plant or leaf, and our AI will first
                    verify it's a plant, then diagnose any visible diseases. If
                    a disease is found, you'll get recommended treatments.
                  </p>
                </div>

                <input
                  type="file"
                  onChange={handleImageSelect}
                  className="mb-4 p-2 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {image && !loading && (
              <div className="flex flex-col items-center justify-center gap-4 mb-4 animate-fade-in delay-100">
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
              <div className="flex flex-col justify-center items-center min-h-[200px] py-6 animate-zoom-in">
                <Helix size="60" speed="1" color="black" />
                <p className="mt-4 text-lg text-gray-700 animate-pulse text-center">
                  {loadingStep === "precheck"
                    ? "Checking image content... 🌱"
                    : "Diagnosing plant disease... 🧪"}
                </p>
              </div>
            ) : (
              diagnosis && (
                <div className="w-full max-w-3xl mx-auto">
                  <div
                    ref={resultRef}
                    className=" rounded-lg text-left animate-fade-in delay-200"
                  >
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
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <div className="w-full text-left px-6 pb-2 animate-fade-in z-10">
        <p className="text-gray-700 text-lg opacity-60 max-w-2xl mx-auto">
          Note: AI responses are subject to change, and may not always be
          accurate or reliable. Always seek professional advice before making
          decisions based on AI-generated information.
        </p>
      </div>
      <footer className="p-4 text-center text-black w-full z-10">
        <p>&copy; 2025 SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DiseaseDetection;