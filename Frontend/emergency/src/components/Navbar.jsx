import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            Vehicle Service
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                        {user && (
                            <>
                                <Link to="/inventory" className="text-gray-600 hover:text-gray-900">Store</Link>
                                <Link to="/emergency" className="text-gray-600 hover:text-gray-900">Emergency</Link>
                                <Link to="/rvhome" className="text-gray-600 hover:text-gray-900">Register</Link>
                            </>
                        )}
                        <Link to="/aboutus" className="text-gray-600 hover:text-gray-900">About Us</Link>
                    </div>
                    
                    <div className="flex items-center">
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            {user.username}
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Sign Up
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