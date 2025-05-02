import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaExclamationTriangle, FaCalendarAlt, FaArrowRight, FaCheck, FaStar, FaUsers, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaShieldAlt, FaCertificate, FaHandshake, FaArrowDown } from 'react-icons/fa';
import Footer from '../shared/Footer';

function Home() {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const imageData = [
        {
            image: './background.png',
            title: 'Expert Vehicle Maintenance',         
            description: 'Guaranteed 100% Satisfaction',
            stats: [
                { label: 'Years of Experience', value: '28+' },
                { label: 'Happy Customers', value: '50,000+' },
                { label: 'Service Centers', value: '40+' }
            ]
        },
        {
            image: './test2.png',
            title: 'Trusted Service Center',
            description: 'Trust 100% for Your Vehicle',
            stats: [
                { label: 'Expert Technicians', value: '200+' },
                { label: 'Services Offered', value: '50+' },
                { label: 'Success Rate', value: '99%' }
            ]
        },
        {
            image: './test3.png',
            title: 'Quality Auto Repairs',
            description: 'Reliable and Professional',
            stats: [
                { label: 'Daily Services', value: '500+' },
                { label: 'Warranty Period', value: '1 Year' },
                { label: 'Customer Rating', value: '4.9/5' }
            ]
        },
        {
            image: './test4.png',
            title: 'Premium Car Care',
            description: 'Your Vehicle Deserves the Best',
            stats: [
                { label: 'Brands Supported', value: '30+' },
                { label: 'Emergency Response', value: '24/7' },
                { label: 'Service Guarantee', value: '100%' }
            ]
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Scroll Indicator */}
            <motion.div 
                className="fixed bottom-4 right-4 z-50 cursor-pointer"
                animate={{ 
                    y: [0, 10, 0],
                    opacity: scrollPosition > 100 ? 1 : 0
                }}
                transition={{ 
                    y: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.3 }
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                    <FaArrowDown className="transform rotate-180" />
                </div>
            </motion.div>

            {/* Slideshow Section */}
            <div className="relative mt-0 overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="relative"
                    >
                        <img
                            src={imageData[currentImageIndex].image}
                            alt="Slideshow Image"
                            className="mx-auto w-full h-[250px] md:h-[600px] object-cover shadow-lg"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-10 left-10 text-left text-white p-6 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm"
                        >
                            <motion.h2 
                                className="text-3xl md:text-5xl font-bold mb-4"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {imageData[currentImageIndex].title}
                            </motion.h2>
                            <motion.p 
                                className="text-lg md:text-xl mb-6"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {imageData[currentImageIndex].description}
                            </motion.p>
                            <motion.div 
                                className="grid grid-cols-3 gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {imageData[currentImageIndex].stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Hero Section */}
            <main className="main-content text-center py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <motion.div
                    className="hero-section max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        28 Years of Excellence
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">Since 1994</p>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">Guaranteed 100% Satisfaction</p>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">Leads with 40 Centres in Sri Lanka</p>
                    </motion.div>
                    
                    <motion.button
                        className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg shadow-lg flex items-center justify-center mx-auto group"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('services')}
                    >
                        Explore Our Services
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>
            </main>

            {/* Why Choose Us Section */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-blue-500 dark:text-blue-400 mb-6">
                                <FaShieldAlt size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                Trusted Service
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Certified technicians with years of experience
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-green-500 dark:text-green-400 mb-6">
                                <FaCertificate size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                Quality Guarantee
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                100% satisfaction guarantee on all services
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-yellow-500 dark:text-yellow-400 mb-6">
                                <FaClock size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                24/7 Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Round-the-clock emergency services
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-purple-500 dark:text-purple-400 mb-6">
                                <FaHandshake size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                Customer Care
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Dedicated support for all your needs
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services" className="container mx-auto px-4 py-20">
                <motion.h2 
                    className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Our Services
                </motion.h2>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                        whileHover={{ y: -10 }}
                    >
                        <div className="text-blue-500 dark:text-blue-400 mb-6">
                            <FaTools size={56} className="mx-auto" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            General Maintenance
                        </h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Regular check-ups
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Oil changes
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Tire rotations
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Brake inspections
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                        whileHover={{ y: -10 }}
                    >
                        <div className="text-green-500 dark:text-green-400 mb-6">
                            <FaCar size={56} className="mx-auto" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            Repair Services
                        </h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Engine repairs
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Transmission work
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Electrical systems
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Suspension work
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
                        whileHover={{ y: -10 }}
                    >
                        <div className="text-red-500 dark:text-red-400 mb-6">
                            <FaExclamationTriangle size={56} className="mx-auto" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            Emergency Services
                        </h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                24/7 roadside assistance
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Towing services
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Emergency repairs
                            </li>
                            <li className="flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Battery jump-starts
                            </li>
                        </ul>
                    </motion.div>
                </motion.div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-blue-500 dark:text-blue-400 mb-4">
                                <FaMapMarkerAlt size={32} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Our Location
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                15 Eramudugaha Junction,Unawatuna
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-green-500 dark:text-green-400 mb-4">
                                <FaPhoneAlt size={32} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Contact Us
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                +94 76 206 0052
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-yellow-500 dark:text-yellow-400 mb-4">
                                <FaEnvelope size={32} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                Email Us
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                info@motron.com
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Quick Actions
                    </motion.h2>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)", y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/emergencyform')}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-all duration-300"
                        >
                            <FaExclamationTriangle size={48} className="mb-4" />
                            <span className="text-xl font-semibold">Emergency Services</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)", y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/registrationform')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-all duration-300"
                        >
                            <FaCar size={48} className="mb-4" />
                            <span className="text-xl font-semibold">Vehicle Registration</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)", y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/inventory')}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-all duration-300"
                        >
                            <FaTools size={48} className="mb-4" />
                            <span className="text-xl font-semibold">View Inventory</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.4)", y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigation('/appointments')}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-all duration-300"
                        >
                            <FaCalendarAlt size={48} className="mb-4" />
                            <span className="text-xl font-semibold">Book Service</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home; 