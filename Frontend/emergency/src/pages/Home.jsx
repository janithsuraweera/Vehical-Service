import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        emergencyCount: 0,
        inventoryCount: 0,
        vehicleCount: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
            fetchStats();
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [emergencyRes, inventoryRes, vehicleRes] = await Promise.all([
                axios.get('http://localhost:5000/api/emergency/count', { headers }),
                axios.get('http://localhost:5000/api/inventory/count', { headers }),
                axios.get('http://localhost:5000/api/vehicle-registration/count', { headers })
            ]);

            setStats({
                emergencyCount: emergencyRes.data.count,
                inventoryCount: inventoryRes.data.count,
                vehicleCount: vehicleRes.data.count
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8">
                            Welcome to Vehicle Service Management
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Your one-stop solution for vehicle maintenance and emergency services
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Emergency Services</h2>
                                <p className="text-gray-600">24/7 roadside assistance and emergency vehicle services</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vehicle Registration</h2>
                                <p className="text-gray-600">Easy and quick vehicle registration process</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Parts Store</h2>
                                <p className="text-gray-600">Quality vehicle parts and accessories</p>
                            </div>
                        </div>
                        <div className="mt-12">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
                    <p className="text-gray-600">Here's your dashboard overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Emergency Services</h2>
                        <p className="text-3xl font-bold text-blue-600">{stats.emergencyCount}</p>
                        <p className="text-gray-600">Active Emergency Requests</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Inventory</h2>
                        <p className="text-3xl font-bold text-green-600">{stats.inventoryCount}</p>
                        <p className="text-gray-600">Items in Stock</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vehicles</h2>
                        <p className="text-3xl font-bold text-purple-600">{stats.vehicleCount}</p>
                        <p className="text-gray-600">Registered Vehicles</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/emergency')}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Request Emergency Service
                            </button>
                            <button
                                onClick={() => navigate('/inventory')}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                            >
                                View Inventory
                            </button>
                            <button
                                onClick={() => navigate('/rvhome')}
                                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                            >
                                Register Vehicle
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">No recent activity to display</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 