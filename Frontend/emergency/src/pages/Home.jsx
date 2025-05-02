import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaExclamationTriangle, FaCalendarAlt, FaChartLine, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Footer from '../shared/Footer';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        emergencyRequests: 0,
        inventoryItems: 0,
        registeredVehicles: 0,
        appointments: 0
    });

    const imageData = [
        {
            image: './background.png',
            title: 'Expert Vehicle Maintenance',         
            description: 'Guaranteed 100% Satisfaction',
        },
        {
            image: './test2.png',
            title: 'Trusted Service Center',
            description: 'Trust 100% for Your Vehicle',
        },
        {
            image: './test3.png',
            title: 'Quality Auto Repairs',
            description: 'Reliable and Professional',
        },
        {
            image: './test4.png',
            title: 'Premium Car Care',
            description: 'Your Vehicle Deserves the Best',
        },
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageData.length);
        }, 10000); 
        return () => clearInterval(intervalId);
    }, [imageData.length]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Simulate API calls
                setStats({
                    emergencyRequests: 12,
                    inventoryItems: 45,
                    registeredVehicles: 78,
                    appointments: 23
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Slideshow Section */}
            <div className="relative mt-0">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className="relative"
                    >
                        <img
                            src={imageData[currentImageIndex].image}
                            alt="Slideshow Image"
                            className="mx-auto w-full h-[250px] md:h-[600px] object-cover shadow-lg"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute top-10 left-10 text-left text-white p-3 bg-black bg-opacity-50 rounded-lg"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold mb-2">
                                {imageData[currentImageIndex].title}
                            </h2>
                            <p className="text-lg md:text-xl">
                                {imageData[currentImageIndex].description}
                            </p>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Hero Section */}
            <main className="main-content text-center py-16 px-6 bg-gray-100 dark:bg-gray-800">
                <motion.div
                    className="hero-section max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white">28 Years of Excellence</h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4">Since 1994</p>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">Guaranteed 100% Satisfaction</p>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">Leads with 40 Centres in Sri Lanka</p>
                    
                    <motion.button
                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </main>

            {/* Dashboard Content */}
            {user && (
                <div className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Here's what's happening with your vehicle service system.
                        </p>
                    </motion.div>

                    {/* Statistics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Object.entries(stats).map(([key, value]) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {key.split(/(?=[A-Z])/).join(' ')}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                            {value}
                                        </p>
                                    </div>
                                    <div className="text-blue-500 dark:text-blue-400">
                                        {key === 'emergencyRequests' && <FaExclamationTriangle size={24} />}
                                        {key === 'inventoryItems' && <FaTools size={24} />}
                                        {key === 'registeredVehicles' && <FaCar size={24} />}
                                        {key === 'appointments' && <FaCalendarAlt size={24} />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/emergency')}
                            className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                        >
                            <FaExclamationTriangle size={32} className="mb-2" />
                            <span>Emergency Services</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/rvhome')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                        >
                            <FaCar size={32} className="mb-2" />
                            <span>Vehicle Registration</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/inventory')}
                            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                        >
                            <FaTools size={32} className="mb-2" />
                            <span>View Inventory</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/appointments')}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                        >
                            <FaCalendarAlt size={32} className="mb-2" />
                            <span>Book Service</span>
                        </motion.button>
                    </div>

                    {/* Services Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                General Maintenance
                            </h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Regular check-ups</li>
                                <li>• Oil changes</li>
                                <li>• Tire rotations</li>
                                <li>• Brake inspections</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                Repair Services
                            </h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Engine repairs</li>
                                <li>• Transmission work</li>
                                <li>• Electrical systems</li>
                                <li>• Suspension work</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                Emergency Services
                            </h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• 24/7 roadside assistance</li>
                                <li>• Towing services</li>
                                <li>• Emergency repairs</li>
                                <li>• Battery jump-starts</li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Recent Activity Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    <div>
                                        <p className="text-gray-800 dark:text-white">Vehicle service completed</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-blue-500 hover:text-blue-600">View Details</button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                    <div>
                                        <p className="text-gray-800 dark:text-white">New appointment scheduled</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-blue-500 hover:text-blue-600">View Details</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home; 