import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaCar, 
    FaTools, 
    FaUsers, 
    FaAward, 
    FaHandshake, 
    FaClock, 
    FaShieldAlt,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope
} from 'react-icons/fa';

const AboutUs = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
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

    const stats = [
        { number: "10+", label: "Years of Experience", icon: <FaClock className="text-blue-500" /> },
        { number: "5000+", label: "Happy Customers", icon: <FaUsers className="text-blue-500" /> },
        { number: "50+", label: "Expert Technicians", icon: <FaTools className="text-blue-500" /> },
        { number: "100%", label: "Customer Satisfaction", icon: <FaAward className="text-blue-500" /> }
    ];

    const features = [
        {
            icon: <FaTools className="text-4xl text-blue-500" />,
            title: "Expert Technicians",
            description: "Our team of certified technicians brings years of experience and expertise to every service."
        },
        {
            icon: <FaCar className="text-4xl text-blue-500" />,
            title: "Modern Equipment",
            description: "We use state-of-the-art diagnostic tools and equipment to ensure precise and efficient service."
        },
        {
            icon: <FaShieldAlt className="text-4xl text-blue-500" />,
            title: "Quality Assurance",
            description: "Every service comes with our quality guarantee, ensuring your complete satisfaction."
        },
        {
            icon: <FaHandshake className="text-4xl text-blue-500" />,
            title: "Customer Service",
            description: "We prioritize your needs and provide personalized service to meet your requirements."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Motrone Vehicle Service</h1>
                        <p className="text-xl text-gray-200">
                            Your trusted partner for all vehicle maintenance and repair needs. We provide quality service with a focus on customer satisfaction.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-16 bg-white dark:bg-gray-800"
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-16 bg-gray-50 dark:bg-gray-900"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Why Choose Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            We are committed to providing the best service experience for your vehicle
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-16 bg-white dark:bg-gray-800"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Get in touch with us for any inquiries or to schedule a service
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                            <FaMapMarkerAlt className="text-2xl text-blue-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Location</h3>
                                <p className="text-gray-600 dark:text-gray-400">15 Eramudugaha Junction,Unawatuna</p>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                            <FaPhoneAlt className="text-2xl text-blue-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Phone</h3>
                                <p className="text-gray-600 dark:text-gray-400">+94 76 206 0052</p>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                            <FaEnvelope className="text-2xl text-blue-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Email</h3>
                                <p className="text-gray-600 dark:text-gray-400">info@motron.com</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutUs; 