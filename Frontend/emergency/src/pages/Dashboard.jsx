import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaWrench, FaExclamationTriangle, FaShoppingCart, FaChartLine, FaCalendarAlt, FaUserFriends, FaTools } from 'react-icons/fa';
import Footer from '../shared/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState({
        emergencyCount: 0,
        inventoryCount: 0,
        vehicleCount: 0,
        appointmentsCount: 0
    });

    const services = [
        {
            icon: <FaWrench className="w-8 h-8" />,
            title: "General Maintenance",
            description: "Regular check-ups and maintenance services"
        },
        {
            icon: <FaTools className="w-8 h-8" />,
            title: "Repair Services",
            description: "Expert repair for all vehicle issues"
        },
        {
            icon: <FaCar className="w-8 h-8" />,
            title: "Emergency Services",
            description: "24/7 roadside assistance"
        }
    ];

    const quickActions = [
        {
            icon: <FaExclamationTriangle className="w-6 h-6" />,
            title: "Emergency Service",
            link: "/emergencyform",
            color: "bg-red-500 hover:bg-red-600"
        },
        {
            icon: <FaCar className="w-6 h-6" />,
            title: "Register Vehicle",
            link: "/registrationform",
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            icon: <FaShoppingCart className="w-6 h-6" />,
            title: "View Inventory",
            link: "/inventory",
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            icon: <FaCalendarAlt className="w-6 h-6" />,
            title: "Book Service",
            link: "/appointments",
            color: "bg-purple-500 hover:bg-purple-600"
        },
        {
            icon: <FaExclamationTriangle className="w-6 h-6" />,
            title: "My Emergencies",
            link: "/my-emergencies",
            color: "bg-orange-500 hover:bg-orange-600"
        }
    ];

    useEffect(() => {
        // Fetch statistics from your API
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Add your API calls here
                // Example:
                // const response = await axios.get('your-api-endpoint', { headers });
                // setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
                            <p className="text-blue-100 mt-2">Here's your dashboard overview</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500">Emergency Requests</p>
                                <h3 className="text-2xl font-bold">{stats.emergencyCount}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaTools className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500">Inventory Items</p>
                                <h3 className="text-2xl font-bold">{stats.inventoryCount}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FaCar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500">Registered Vehicles</p>
                                <h3 className="text-2xl font-bold">{stats.vehicleCount}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <FaCalendarAlt className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500">Appointments</p>
                                <h3 className="text-2xl font-bold">{stats.appointmentsCount}</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(action.link)}
                            className={`${action.color} text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center`}
                        >
                            {action.icon}
                            <span className="mt-2 font-semibold">{action.title}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <div className="text-blue-600 mb-4">{service.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <FaCar className="w-6 h-6 text-blue-600 mr-4" />
                                <div>
                                    <p className="font-semibold">Vehicle Registration</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <span className="text-green-600 font-semibold">Completed</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <FaWrench className="w-6 h-6 text-yellow-600 mr-4" />
                                <div>
                                    <p className="font-semibold">Maintenance Service</p>
                                    <p className="text-sm text-gray-500">1 day ago</p>
                                </div>
                            </div>
                            <span className="text-blue-600 font-semibold">In Progress</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard; 