import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import Footer from '../shared/Footer';

function Home() {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageData.length);
        }, 10000); 
        return () => clearInterval(intervalId);
    }, [imageData.length]);

    const handleNavigation = (path) => {
        navigate(path);
    };

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

            {/* Services Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
                    >
                        <div className="text-blue-500 dark:text-blue-400 mb-4">
                            <FaTools size={48} className="mx-auto" />
                        </div>
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
                    >
                        <div className="text-green-500 dark:text-green-400 mb-4">
                            <FaCar size={48} className="mx-auto" />
                        </div>
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
                    >
                        <div className="text-red-500 dark:text-red-400 mb-4">
                            <FaExclamationTriangle size={48} className="mx-auto" />
                        </div>
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
            </div>

            {/* Quick Actions Section */}
            <div className="bg-gray-100 dark:bg-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/emergencyform')}
                            className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                        >
                            <FaExclamationTriangle size={32} className="mb-2" />
                            <span>Emergency Services</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/registrationform')}
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
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home; 