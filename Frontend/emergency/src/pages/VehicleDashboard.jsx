import React, { useState } from 'react';

// 10 common dashboard warning signs
const errorDatabase = [
  {
    name: "Check Engine Light",
    image: "/errors/check_engine.png",
    solution: "Engine or emission issue. Get diagnostic scan done immediately."
  },
  {
    name: "Oil Pressure Warning",
    image: "/errors/oil_pressure.png",
    solution: "Low oil pressure. Stop the engine and check oil level."
  },
  {
    name: "Battery Alert",
    image: "/errors/battery.png",
    solution: "Battery not charging. Check alternator and battery terminals."
  },
  {
    name: "Brake System Warning",
    image: "/errors/brake.png",
    solution: "Brake system issue. Check brake fluid and pads."
  },
  {
    name: "ABS Warning Light",
    image: "/errors/abs.png",
    solution: "Anti-lock Braking System issue. ABS may be disabled."
  },
  {
    name: "Coolant Temperature Warning",
    image: "/errors/coolant.png",
    solution: "Engine overheating. Check coolant level and radiator."
  },
  {
    name: "Tire Pressure Warning",
    image: "/errors/tire_pressure.png",
    solution: "Low tire pressure detected. Inflate to recommended PSI."
  },
  {
    name: "Airbag Warning Light",
    image: "/errors/airbag.png",
    solution: "Airbag system issue. May not deploy in crash."
  },
  {
    name: "Traction Control Light",
    image: "/errors/traction.png",
    solution: "Traction control disabled. Drive carefully on slippery roads."
  },
  {
    name: "Fuel Warning Light",
    image: "/errors/fuel.png",
    solution: "Fuel level low. Refill as soon as possible."
  }
];

function VehicleDashboard() {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [detectedError, setDetectedError] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImg(URL.createObjectURL(file));
      // Simulate detection by random selection
      const randomError = errorDatabase[Math.floor(Math.random() * errorDatabase.length)];
      setTimeout(() => setDetectedError(randomError), 1000);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-center">🚗 Vehicle Dashboard Error Finder</h1>

      <div className="flex flex-col items-center">
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />

        {uploadedImg && (
          <img src={uploadedImg} alt="Uploaded" className="w-40 h-40 object-contain border rounded shadow" />
        )}

        {detectedError && (
          <div className="mt-6 p-5 bg-white rounded shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2">{detectedError.name}</h2>
            <img src={detectedError.image} alt={detectedError.name} className="mx-auto w-20 h-20 mb-3" />
            <p className="text-gray-700">{detectedError.solution}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleDashboard;
