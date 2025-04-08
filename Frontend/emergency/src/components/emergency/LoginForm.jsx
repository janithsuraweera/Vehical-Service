import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa'; // Import admin icon

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Login submitted', { email, password });
    };

    //

    const handleBack = () => {
        navigate('/'); // Navigate back to the home page or previous page
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                        <a
                            className="inline-block align-baseline font-semibold text-sm text-blue-600 hover:text-blue-800"
                            href="/forgot-password" // Replace with your forgot password route
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-8 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full"
                    >
                        Back
                    </button>
                    <Link
                        to="/list" // Replace with your EmergencyList route
                         className="mt-4  bg-green-500  hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                        // className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                    >
                         Admin View
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;