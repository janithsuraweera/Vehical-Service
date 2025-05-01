import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaTools, FaClipboardList, FaCar, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalServices: 0,
        totalBookings: 0,
        totalVehicles: 0,
        totalEmergencies: 0,
        totalErrors: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [usersRes, vehiclesRes, emergenciesRes, errorsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users/count', { headers }),
                axios.get('http://localhost:5000/api/vehicle-registration/count', { headers }),
                axios.get('http://localhost:5000/api/emergency', { headers }),
                axios.get('http://localhost:5000/api/vehicle-errors/count', { headers })
            ]);

            setStats({
                totalUsers: usersRes.data.count,
                totalVehicles: vehiclesRes.data.count,
                totalEmergencies: emergenciesRes.data.length,
                totalErrors: errorsRes.data.count,
                totalServices: 0,
                totalBookings: 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <FaUsers className="h-8 w-8" />,
            color: 'bg-blue-500',
            link: '/admin/users',
            description: 'View and manage all system users'
        },
        {
            title: 'Vehicle Errors',
            value: stats.totalErrors,
            icon: <FaExclamationTriangle className="h-8 w-8" />,
            color: 'bg-red-500',
            link: '/vehicle-errors'
        },
        {
            title: 'Emergency Cases',
            value: stats.totalEmergencies,
            icon: <FaClipboardList className="h-8 w-8" />,
            color: 'bg-yellow-500',
            link: '/emergencylist',
            description: 'View all emergency cases'
        },
        {
            title: 'Registered Vehicles',
            value: stats.totalVehicles,
            icon: <FaCar className="h-8 w-8" />,
            color: 'bg-green-500',
            link: '/view-registrations'
        },
        {
            title: 'Total Services',
            value: stats.totalServices,
            icon: <FaTools className="h-8 w-8" />,
            color: 'bg-purple-500',
            link: '/services'
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: <FaChartLine className="h-8 w-8" />,
            color: 'bg-indigo-500',
            link: '/bookings'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Welcome back, {user.username}! Here's an overview of your system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Link to={card.link}>
                                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 ${card.color} rounded-md p-3 text-white`}>
                                                    {card.icon}
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                            {card.title}
                                                        </dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                                {loading ? '...' : card.value}
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                        >
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    to="/vehicle-errors"
                                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    <FaExclamationTriangle className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Errors</span>
                                </Link>
                                <Link
                                    to="/emergencylist"
                                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                                >
                                    <FaClipboardList className="h-6 w-6 text-yellow-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">View Emergencies</span>
                                </Link>
                                <Link
                                    to="/view-registrations"
                                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                >
                                    <FaCar className="h-6 w-6 text-green-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Vehicle Registrations</span>
                                </Link>
                                <Link
                                    to="/inventory-list"
                                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    <FaTools className="h-6 w-6 text-purple-500 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Inventory</span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                        >
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No recent activity to display
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 