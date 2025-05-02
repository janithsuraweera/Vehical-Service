import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaPhone, FaArrowLeft, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        username: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
    const navigate = useNavigate();

    const commonEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, email: value }));
        
        if (value.includes('@')) {
            const [localPart, domain] = value.split('@');
            if (domain !== undefined) {
                const filteredDomains = commonEmailDomains.filter(d => d.startsWith(domain) && d !== domain);
                const suggestions = filteredDomains.length > 0
                    ? filteredDomains.map(d => `${localPart}@${d}`)
                    : commonEmailDomains.map(d => `${localPart}@${d}`);
                setEmailSuggestions(suggestions);
                setShowEmailSuggestions(suggestions.length > 0);
            } else {
                // If user just typed @, show all domains
                const suggestions = commonEmailDomains.map(d => `${localPart}@${d}`);
                setEmailSuggestions(suggestions);
                setShowEmailSuggestions(true);
            }
        } else {
            setShowEmailSuggestions(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: value }));
        
        if (errors.phone) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.phone;
                return newErrors;
            });
        }
    };

    const handleEmailSuggestionClick = (suggestion) => {
        setFormData(prev => ({ ...prev, email: suggestion }));
        setShowEmailSuggestions(false);
        setEmailSuggestions([]);
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const nameRegex = /^[a-zA-Z\s]{3,}$/;

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Name should contain only letters and be at least 3 characters long';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newData = {
                ...prevData,
                [name]: value
            };
            
            if (name === 'name') {
                const username = value.toLowerCase().replace(/\s+/g, '_');
                newData.username = username;
            }
            
            return newData;
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCopyUsername = () => {
        navigator.clipboard.writeText(formData.username);
        toast.success('Username copied to clipboard!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                username: formData.username
            });

            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred during registration';
            const errorDetails = error.response?.data?.error || '';
            setErrors(prev => ({
                ...prev,
                submit: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`
            }));
            toast.error(errorMessage);
            console.error('Registration error:', error.response?.data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="./background.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-10"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative z-10"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Create Your Account</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <FaArrowLeft size={24} />
                    </button>
                </div>

                {errors.submit && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg"
                    >
                        {errors.submit}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleEmailChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {showEmailSuggestions && emailSuggestions.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                                        {emailSuggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleEmailSuggestionClick(suggestion)}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.email && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        maxLength="10"
                                        className={`block w-full pl-10 pr-3 py-3 border ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Username (Auto-generated)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyUsername}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        title="Copy username"
                                    >
                                        <FaCopy size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Username is automatically generated from your full name
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyUsername}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center space-x-1"
                                    >
                                        <FaCopy size={12} />
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-3 border ${
                                            errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                                )}
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <ul className="list-disc list-inside">
                                                <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : ''}>One lowercase letter</li>
                                                <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : ''}>One uppercase letter</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className="list-disc list-inside">
                                                <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-500' : ''}>One number</li>
                                                <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-500' : ''}>One special character</li>
                                                <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>At least 8 characters</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-3 border ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all relative ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupForm;