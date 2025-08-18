import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyErrors = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchErrors = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:5000/api/vehicle-errors/my-errors', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setErrors(response.data || []);
            } catch (err) {
                console.error('Error fetching error reports:', err);
                setError(err.response?.data?.message || 'Failed to fetch error reports');
            } finally {
                setLoading(false);
            }
        };

        fetchErrors();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to view your error reports</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Loading your error reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Error Reports</h2>
                    <button
                        onClick={() => navigate('/report-error')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Report New Error
                    </button>
                </div>

                {errors.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">You haven't reported any errors yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {errors.map((error) => (
                            <div key={error._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {error.vehicleRegistrationNumber}
                                        </h3>
                                        <p className="text-gray-600">
                                            {new Date(error.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        error.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        error.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {error.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Error Type:</span> {error.errorType}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Severity:</span> {error.severity}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Location:</span> {error.location}
                                    </p>
                                    <p className="text-gray-700 mt-2">
                                        <span className="font-semibold">Description:</span> {error.description}
                                    </p>
                                </div>

                                {error.photos && error.photos.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Photos:</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {error.photos.map((photo, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:5000${photo}`}
                                                    alt={`Error photo ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyErrors; 