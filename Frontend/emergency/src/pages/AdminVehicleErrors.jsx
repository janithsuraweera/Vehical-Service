import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminVehicleErrors = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, in_progress, resolved
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchErrors = async () => {
            if (!user || user.role !== 'admin') return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:5000/api/vehicle-errors/all', {
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

    const handleStatusChange = async (errorId, newStatus) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/vehicle-errors/${errorId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setErrors(errors.map(error => 
                error._id === errorId ? response.data : error
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || 'Failed to update status');
        }
    };

    const filteredErrors = errors.filter(error => {
        const matchesFilter = filter === 'all' || error.status === filter;
        const matchesSearch = searchTerm === '' || 
            error.vehicleRegistrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            error.errorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            error.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="mb-4">You don't have permission to view this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go to Home
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
                    <p className="mt-4">Loading error reports...</p>
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
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Vehicle Error Reports</h2>
                    <div className="flex space-x-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {filteredErrors.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">No error reports found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredErrors.map((error) => (
                            <div key={error._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {error.vehicleRegistrationNumber}
                                        </h3>
                                        <p className="text-gray-600">
                                            Reported by: {error.userId?.username || 'Unknown User'}
                                        </p>
                                        <p className="text-gray-600">
                                            {new Date(error.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={error.status}
                                            onChange={(e) => handleStatusChange(error._id, e.target.value)}
                                            className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                                error.status === 'resolved' ? 'bg-green-100' :
                                                error.status === 'in_progress' ? 'bg-yellow-100' :
                                                'bg-red-100'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
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

export default AdminVehicleErrors; 