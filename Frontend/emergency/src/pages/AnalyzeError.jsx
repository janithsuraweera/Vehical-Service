import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUpload, FaSpinner, FaSearch } from 'react-icons/fa';

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
            const uploadResponse = await axios.post('http://localhost:5000/api/vehicle-errors/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Then, analyze the image using ChatGPT API
            const analysisResponse = await axios.post('http://localhost:5000/api/vehicle-errors/analyze', {
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
            const response = await axios.post('http://localhost:5000/api/vehicle-errors/report', {
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
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">Analyze Vehicle Error</h2>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Choose an image</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 flex items-center"
                            >
                                <FaUpload className="mr-2" />
                                Upload Image
                            </label>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded"
                                />
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            onClick={analyzeImage}
                            disabled={!selectedImage || loading}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
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

                        {analysis && (
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Submit Error Report
                            </button>
                        )}
                    </div>
                </div>

                {analysis && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Error Type:</span> {analysis.errorType}</p>
                            <p><span className="font-semibold">Severity:</span> {analysis.severity}</p>
                            <p><span className="font-semibold">Description:</span> {analysis.description}</p>
                            <p><span className="font-semibold">Location:</span> {analysis.location}</p>
                        </div>
                    </div>
                )}

                {searchHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Search History</h3>
                        <div className="space-y-4">
                            {searchHistory.map((item, index) => (
                                <div key={index} className="border-b pb-4">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={`Analysis ${index + 1}`}
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </p>
                                            <p className="font-semibold">{item.analysis.errorType}</p>
                                            <p className="text-sm">{item.analysis.description}</p>
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