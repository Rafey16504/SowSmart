import React, { useState } from "react";

const DiseaseDetection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) return;

    setImage(uploadedImage);

    setDiagnosis("Bacterial Blight");
    setTreatment("Use copper-based fungicides and improve drainage.");
  };

  return (
    <div className="font-grotesk bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center bg-green-700 p-4 w-full">
        <h1 className="text-white text-5xl font-semibold">Disease Detection</h1>
      </div>

      <main className="flex-grow py-10 w-full max-w-4xl">
        <div className="px-4 flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg mb-8 w-full text-center">
            <p className="text-3xl font-semibold text-gray-800 mb-4">Upload Your Plant Image</p>

            
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
              <div className="bg-yellow-100 p-6 rounded-lg shadow-lg w-full mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Diagnosis:</h3>
                <p className="text-gray-700">Disease: {diagnosis}</p>
                <h4 className="text-lg font-semibold text-gray-800 mt-4">Treatment Recommendations:</h4>
                <p className="text-gray-700">{treatment}</p>
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
