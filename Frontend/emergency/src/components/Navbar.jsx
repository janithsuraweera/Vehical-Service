import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaStore, FaExclamationTriangle, FaCar, FaWrench, FaInfoCircle, FaUser, FaSignOutAlt, FaMoon, FaSun, FaShoppingCart, FaListAlt, FaPlus } from 'react-icons/fa';
import logo from '/logo.png';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        // Set active tab based on current path
        const path = location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path === '/inventory') setActiveTab('store');
        else if (path === '/emergencyform' || path === '/emergencylist') setActiveTab('emergency');
        else if (path === '/rvhome') setActiveTab('register');
        else if (path === '/vehicle-errors') setActiveTab('vehicle-errors');
        else if (path === '/aboutus') setActiveTab('about');
        else setActiveTab('');
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    // Function to determine if a tab is active
    const isActive = (tabName) => {
        return activeTab === tabName;
    };

    // Function to get tab styling based on active state
    const getTabStyle = (tabName) => {
        const baseStyle = "flex items-center cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg relative group";
        const activeStyle = "text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20";
        const inactiveStyle = "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white";
        
        return `${baseStyle} ${isActive(tabName) ? activeStyle : inactiveStyle}`;
    };

    return (
        <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center -ml-28">
                        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-0">
                            <img 
                                src={logo} 
                                alt="Motrone Logo" 
                                className="h-20 w-auto"
                            />
                            <span className="text-2xl">Motrone</span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-2">
                        {(!user || user.role !== 'admin') && (
                            <Link to="/" className={getTabStyle('home')}>
                                <span className="group-hover:opacity-0 transition-opacity duration-300">Home</span>
                                <FaHome className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                            </Link>
                        )}
                        {user && (
                            <>
                                {user.role !== 'admin' && (
                                    <Link to="/inventory" className={getTabStyle('store')}>
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">Store</span>
                                        <FaStore className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/inventory-list" className={getTabStyle('inventory-list')}>
                                            <span className="group-hover:opacity-0 transition-opacity duration-300">Inventory List</span>
                                            <FaListAlt className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                        </Link>
                                        <Link to="/vehicle-errors" className={getTabStyle('vehicle-errors')}>
                                            <span className="group-hover:opacity-0 transition-opacity duration-300">Vehicle Errors</span>
                                            <FaWrench className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                        </Link>
                                    </>
                                )}
                                {user.role === 'admin' ? (
                                    <Link to="/emergencylist" className={getTabStyle('emergency')}>
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">Emergency List</span>
                                        <FaExclamationTriangle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                    </Link>
                                ) : (
                                    <Link to="/emergencyform" className={getTabStyle('emergency')}>
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">Emergency Form</span>
                                        <FaExclamationTriangle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                    </Link>
                                )}
                                {user && user.role !== 'admin' && (
                                    <Link to="/registrationform" className={getTabStyle('register')}>
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">Vehicle Register</span>
                                        <FaCar className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/view-registrations" className={getTabStyle('view-registrations')}>
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">Vehicle Registrations</span>
                                        <FaListAlt className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                    </Link>
                                )}
                            </>
                        )}
                        {(!user || user.role !== 'admin') && (
                            <Link to="/aboutus" className={getTabStyle('about')}>
                                <span className="group-hover:opacity-0 transition-opacity duration-300">About Us</span>
                                <FaInfoCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                            </Link>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user && user.role !== 'admin' && (
                            <Link to="/cart" className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FaShoppingCart size={18} />
                            </Link>
                        )}
                        {user && <NotificationBell />}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            } transition-colors duration-200`}
                        >
                            {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                        </button>
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={handleProfileClick}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition-colors duration-200">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                                            {user.username}
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <span className="group-hover:opacity-0 transition-opacity duration-300">Profile</span>
                                            <FaUser className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link 
                                                to="/admin" 
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <span className="group-hover:opacity-0 transition-opacity duration-300">Admin Dashboard</span>
                                                <FaUser className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                        >
                                            <span className="group-hover:opacity-0 transition-opacity duration-300">Logout</span>
                                            <FaSignOutAlt className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                >
                                    <span className="group-hover:opacity-0 transition-opacity duration-300">Sign In</span>
                                    <FaUser className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-colors duration-200 relative group"
                                >
                                    <span className="group-hover:opacity-0 transition-opacity duration-300">Sign Up</span>
                                    <FaUser className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={18} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 