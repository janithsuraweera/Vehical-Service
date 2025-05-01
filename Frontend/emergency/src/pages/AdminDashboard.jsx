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
        totalVehicles: 0,
        totalEmergencies: 0,
        totalErrors: 0,
        totalInventory: 0
    });
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            setIsRefreshing(true);
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [usersRes, vehiclesRes, emergenciesRes, inventoryRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users/count', { headers }),
                axios.get('http://localhost:5000/api/vehicle-registration/count', { headers }),
                axios.get('http://localhost:5000/api/emergency', { headers }),
                axios.get('http://localhost:5000/api/inventory', { headers })
            ]);

            setStats({
                totalUsers: usersRes.data.count || 0,
                totalVehicles: vehiclesRes.data.count || 0,
                totalEmergencies: Array.isArray(emergenciesRes.data) ? emergenciesRes.data.length : 0,
                totalErrors: 0,
                totalInventory: Array.isArray(inventoryRes.data) ? inventoryRes.data.length : 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats(prevStats => ({
                ...prevStats,
                totalUsers: prevStats.totalUsers || 0,
                totalVehicles: prevStats.totalVehicles || 0,
                totalEmergencies: prevStats.totalEmergencies || 0,
                totalInventory: prevStats.totalInventory || 0
            }));
        } finally {
            setLoading(false);
            setIsRefreshing(false);
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
            icon: <FaUsers className="h-10 w-10" />,
            color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
            link: '/admin/users',
            description: 'View and manage all system users',
            special: true
        },
        {
            title: 'Vehicle Errors',
            value: stats.totalErrors,
            icon: <FaExclamationTriangle className="h-10 w-10" />,
            color: 'bg-gradient-to-r from-red-500 to-pink-600',
            link: '/vehicle-errors'
        },
        {
            title: 'Emergency Cases',
            value: stats.totalEmergencies,
            icon: <FaClipboardList className="h-10 w-10" />,
            color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
            link: '/emergencylist',
            description: 'View all emergency cases'
        },
        {
            title: 'Registered Vehicles',
            value: stats.totalVehicles,
            icon: <FaCar className="h-10 w-10" />,
            color: 'bg-gradient-to-r from-green-500 to-emerald-600',
            link: '/view-registrations'
        },
        {
            title: 'Inventory Items',
            value: stats.totalInventory,
            icon: <FaTools className="h-10 w-10" />,
            color: 'bg-gradient-to-r from-purple-500 to-violet-600',
            link: '/inventory-list',
            description: 'View and manage inventory items'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-blue-600">
                            Admin Dashboard
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                            Welcome back, <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.username}</span>! Here's an overview of your system.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Total Users Card - Full Width */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            className="h-full"
                        >
                            <Link to="/admin/users" className="h-full block">
                                <div className={`bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 backdrop-blur-sm overflow-hidden shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-400/20 dark:border-blue-500/20 h-full relative ${isRefreshing ? 'animate-pulse' : ''}`}>
                                    {isRefreshing && (
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                                    )}
                                    <div className="p-8 h-full flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 bg-white/20 rounded-2xl p-6 text-white shadow-xl ${isRefreshing ? 'animate-spin' : ''}`}>
                                                    <FaUsers className="h-12 w-12" />
                                                </div>
                                                <div className="ml-8">
                                                    <h3 className="text-2xl font-bold text-white">
                                                        Total Users
                                                    </h3>
                                                    <p className="mt-1 text-blue-100">
                                                        View and manage all system users
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div 
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="relative"
                                            >
                                                <div className={`text-6xl font-black text-white ${isRefreshing ? 'animate-pulse' : ''}`}>
                                                    {loading ? '...' : stats.totalUsers}
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Other Cards Grid */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {statCards.slice(1).map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="h-full"
                                >
                                    <Link to={card.link} className="h-full block">
                                        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 h-full relative ${isRefreshing ? 'animate-pulse' : ''}`}>
                                            {isRefreshing && (
                                                <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                                            )}
                                            <div className="p-8 h-full flex flex-col">
                                                <div className="flex items-center flex-grow">
                                                    <div className={`flex-shrink-0 ${card.color} rounded-2xl p-5 text-white shadow-xl ${isRefreshing ? 'animate-spin' : ''}`}>
                                                        {card.icon}
                                                    </div>
                                                    <div className="ml-6 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                                                {card.title}
                                                            </dt>
                                                            <dd className="flex items-baseline mt-2">
                                                                <motion.div 
                                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                                    className="relative"
                                                                >
                                                                    <div className={`text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent ${isRefreshing ? 'animate-pulse' : ''}`}>
                                                                        {loading ? '...' : card.value}
                                                                    </div>
                                                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                                                </motion.div>
                                                            </dd>
                                                            {card.description && (
                                                                <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                                                                    {card.description}
                                                                </p>
                                                            )}
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-10 hover:shadow-3xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-8">
                                <Link
                                    to="/vehicle-errors"
                                    className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 dark:border-blue-800/20"
                                >
                                    <FaExclamationTriangle className="h-10 w-10 text-blue-500 mb-4" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Manage Errors</span>
                                </Link>
                                <Link
                                    to="/emergencylist"
                                    className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-all duration-300 transform hover:-translate-y-2 border border-yellow-100 dark:border-yellow-800/20"
                                >
                                    <FaClipboardList className="h-10 w-10 text-yellow-500 mb-4" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">View Emergencies</span>
                                </Link>
                                <Link
                                    to="/view-registrations"
                                    className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300 transform hover:-translate-y-2 border border-green-100 dark:border-green-800/20"
                                >
                                    <FaCar className="h-10 w-10 text-green-500 mb-4" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Vehicle Registrations</span>
                                </Link>
                                <Link
                                    to="/inventory-list"
                                    className="p-8 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 dark:border-purple-800/20"
                                >
                                    <FaTools className="h-10 w-10 text-purple-500 mb-4" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Inventory</span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-10 hover:shadow-3xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recent Activity</h2>
                            <div className="space-y-4">
                                <div className="text-lg text-gray-500 dark:text-gray-400 italic">
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