import React, { useState } from 'react';
import { FaCar, FaUpload, FaSearch, FaInfoCircle } from 'react-icons/fa';

// 10 common dashboard warning signs
const errorDatabase = [
  {
    name: "Check Engine Light",
    image: "/errors/check_engine.png",
    solution: "Engine or emission issue. Get diagnostic scan done immediately.",
    severity: "High"
  },
  {
    name: "Oil Pressure Warning",
    image: "/errors/oil_pressure.png",
    solution: "Low oil pressure. Stop the engine and check oil level.",
    severity: "Critical"
  },
  {
    name: "Battery Alert",
    image: "/errors/battery.png",
    solution: "Battery not charging. Check alternator and battery terminals.",
    severity: "Medium"
  },
  {
    name: "Brake System Warning",
    image: "/errors/brake.png",
    solution: "Brake system issue. Check brake fluid and pads.",
    severity: "Critical"
  },
  {
    name: "ABS Warning Light",
    image: "/errors/abs.png",
    solution: "Anti-lock Braking System issue. ABS may be disabled.",
    severity: "High"
  },
  {
    name: "Coolant Temperature Warning",
    image: "/errors/coolant.png",
    solution: "Engine overheating. Check coolant level and radiator.",
    severity: "Critical"
  },
  {
    name: "Tire Pressure Warning",
    image: "/errors/tire_pressure.png",
    solution: "Low tire pressure detected. Inflate to recommended PSI.",
    severity: "Medium"
  },
  {
    name: "Airbag Warning Light",
    image: "/errors/airbag.png",
    solution: "Airbag system issue. May not deploy in crash.",
    severity: "High"
  },
  {
    name: "Traction Control Light",
    image: "/errors/traction.png",
    solution: "Traction control disabled. Drive carefully on slippery roads.",
    severity: "Medium"
  },
  {
    name: "Fuel Warning Light",
    image: "/errors/fuel.png",
    solution: "Fuel level low. Refill as soon as possible.",
    severity: "Low"
  }
];

function VehicleDashboard() {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [detectedError, setDetectedError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setUploadedImg(URL.createObjectURL(file));
      // Simulate detection by random selection
      setTimeout(() => {
        const randomError = errorDatabase[Math.floor(Math.random() * errorDatabase.length)];
        setDetectedError(randomError);
        setLoading(false);
      }, 1500);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <FaCar className="mr-2" />
            Vehicle Error Detection
          </h1>
          <p className="text-gray-600">Upload a photo of your vehicle's warning light to identify the issue</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col items-center">
            <label className="w-full max-w-md mb-4">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
            </label>

            {loading && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Analyzing image...</span>
              </div>
            )}

            {uploadedImg && !loading && (
              <div className="w-full max-w-md mb-4">
                <img
                  src={uploadedImg}
                  alt="Uploaded"
                  className="w-full h-48 object-contain border rounded shadow"
                />
              </div>
            )}

            {detectedError && !loading && (
              <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{detectedError.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(detectedError.severity)}`}>
                      {detectedError.severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={detectedError.image}
                      alt={detectedError.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-gray-700">{detectedError.solution}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaInfoCircle className="mr-2" />
                    <span>This is a simulated detection. For accurate results, consult a professional mechanic.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Common Vehicle Warning Lights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {errorDatabase.map((error, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{error.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(error.severity)}`}>
                    {error.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{error.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDashboard;
