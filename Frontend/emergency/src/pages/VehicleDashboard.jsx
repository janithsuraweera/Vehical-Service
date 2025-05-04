import React, { useState } from 'react';
import { FaCar, FaUpload, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Error database with exact filenames
const errorDatabase = [
  {
    filename: "001.png",
    name: "Check Engine Light",
    image: "http://localhost:5000/uploads/error-photos/001.png",
    solution: "Engine or emission issue. Get diagnostic scan done immediately.",
    severity: "High"
  },
  {
    filename: "002.png",
    name: "Oil Pressure Warning",
    image: "http://localhost:5000/uploads/error-photos/002.png",
    solution: "Low oil pressure. Stop the engine and check oil level.",
    severity: "Critical"
  },
  {
    filename: "003.png",
    name: "Battery Alert",
    image: "http://localhost:5000/uploads/error-photos/003.png",
    solution: "Battery not charging. Check alternator and battery terminals.",
    severity: "Medium"
  },
  {
    filename: "004.png",
    name: "Brake System Warning",
    image: "http://localhost:5000/uploads/error-photos/004.png",
    solution: "Brake system issue. Check brake fluid and pads.",
    severity: "Critical"
  },
  {
    filename: "005.png",
    name: "ABS Warning Light",
    image: "http://localhost:5000/uploads/error-photos/005.png",
    solution: "Anti-lock Braking System issue. ABS may be disabled.",
    severity: "High"
  },
  {
    filename: "006.png",
    name: "Coolant Temperature Warning",
    image: "http://localhost:5000/uploads/error-photos/006.png",
    solution: "Engine overheating. Check coolant level and radiator.",
    severity: "Critical"
  },
  {
    filename: "007.png",
    name: "Tire Pressure Warning",
    image: "http://localhost:5000/uploads/error-photos/007.png",
    solution: "Low tire pressure detected. Inflate to recommended PSI.",
    severity: "Medium"
  },
  {
    filename: "008.png",
    name: "Airbag Warning Light",
    image: "http://localhost:5000/uploads/error-photos/008.png",
    solution: "Airbag system issue. May not deploy in crash.",
    severity: "High"
  },
  {
    filename: "009.png",
    name: "Traction Control Light",
    image: "http://localhost:5000/uploads/error-photos/009.png",
    solution: "Traction control disabled. Drive carefully on slippery roads.",
    severity: "Medium"
  },
  {
    filename: "0010.jpg",
    name: "Fuel Warning Light",
    image: "http://localhost:5000/uploads/error-photos/0010.jpg",
    solution: "Fuel level low. Refill as soon as possible.",
    severity: "Low"
  }
];

function VehicleDashboard() {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [detectedError, setDetectedError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setUploadedImg(URL.createObjectURL(file));
      
      try {
        // Get the filename from the uploaded file
        const uploadedFilename = file.name;
        
        // Find matching error in database based on the exact filename
        const matchedError = errorDatabase.find(error => error.filename === uploadedFilename);

        if (matchedError) {
          setDetectedError(matchedError);
        } else {
          setDetectedError({
            name: "Unknown Warning",
            image: "/test1.png",
            solution: "This warning light is not recognized. Please consult a professional mechanic.",
            severity: "Unknown"
          });
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setDetectedError({
          name: "Processing Error",
          image: "/test1.png",
          solution: "Failed to process the image. Please try again or consult a professional mechanic.",
          severity: "Unknown"
        });
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center text-indigo-800">
            <FaCar className="mr-3" />
            Vehicle Error Detection
          </h1>
          <p className="text-gray-600 text-lg">Upload a photo of your vehicle's warning light to identify the issue</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col items-center">
            <label className="w-full max-w-md mb-6">
              <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-indigo-50">
                <div className="text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-indigo-400" />
                  <p className="mt-4 text-lg text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <span className="text-gray-600 text-lg">Processing image...</span>
              </div>
            )}

            {uploadedImg && !loading && (
              <div className="w-full max-w-md mb-6">
                <h3 className="text-xl font-semibold mb-3 text-indigo-800">Uploaded Image</h3>
                <img
                  src={uploadedImg}
                  alt="Uploaded"
                  className="w-full h-64 object-contain border-2 border-indigo-200 rounded-xl shadow-lg"
                />
              </div>
            )}

            {detectedError && !loading && (
              <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-indigo-800">{detectedError.name}</h2>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getSeverityColor(detectedError.severity)}`}>
                      {detectedError.severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 mb-4">
                    <img
                      src={detectedError.image}
                      alt={detectedError.name}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-gray-700 text-lg">{detectedError.solution}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 bg-indigo-50 p-3 rounded-lg">
                    <FaInfoCircle className="mr-2 text-indigo-500" />
                    <span>This is a simulated detection. For accurate results, consult a professional mechanic.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View Common Warning Lights
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-800">Common Vehicle Warning Lights</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {errorDatabase.map((error, index) => (
                  <div key={index} className="border border-indigo-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-indigo-800">{error.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={error.image}
                        alt={error.name}
                        className="w-16 h-16 object-contain"
                      />
                      <p className="text-gray-700">{error.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleDashboard;
