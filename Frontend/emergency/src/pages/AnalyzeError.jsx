import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUpload, FaSpinner, FaSearch, FaImage, FaHistory, FaCheck } from 'react-icons/fa';

const AnalyzeError = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
            setAnalysis(null);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            // First, upload the image
            const uploadResponse = await axios.post('http://localhost:5000/api/vehicleError/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Then, analyze the image
            const analysisResponse = await axios.post('http://localhost:5000/api/vehicleError/analyze', {
                imageUrl: uploadResponse.data.imageUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setAnalysis(analysisResponse.data);
            setSearchHistory(prev => [...prev, {
                imageUrl: uploadResponse.data.imageUrl,
                analysis: analysisResponse.data,
                timestamp: new Date()
            }]);
        } catch (err) {
            setError(err.response?.data?.message || 'Error analyzing image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!analysis) {
            setError('Please analyze the image first');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/vehicleError/report', {
                ...analysis,
                photos: [previewUrl]
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            navigate('/my-errors');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending error report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Vehicle Error Analysis</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Image Upload and Analysis */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                                <div className="text-center">
                                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 inline-flex items-center">
                                            <FaUpload className="mr-2" />
                                            Upload Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Upload a clear image of the vehicle error
                                    </p>
                                </div>
                            </div>

                            {previewUrl && (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        onClick={analyzeImage}
                                        disabled={loading}
                                        className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <FaSearch className="mr-2" />
                                                Analyze
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Analysis Results */}
                        <div className="space-y-6">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {analysis && (
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Analysis Results</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Error Type</p>
                                                <p className="font-medium">{analysis.errorType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Severity</p>
                                                <p className="font-medium">{analysis.severity}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Description</p>
                                            <p className="font-medium">{analysis.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium">{analysis.location}</p>
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                                        >
                                            <FaCheck className="mr-2" />
                                            Submit Error Report
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search History */}
                {searchHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <FaHistory className="mr-2" />
                            Search History
                        </h3>
                        <div className="space-y-4">
                            {searchHistory.map((item, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={`Analysis ${index + 1}`}
                                            className="h-20 w-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </p>
                                            <p className="font-semibold text-gray-800">{item.analysis.errorType}</p>
                                            <p className="text-sm text-gray-600">{item.analysis.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzeError;