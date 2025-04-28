import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setSuccess(true);
            toast.success('Password reset instructions have been sent to your email');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while processing your request';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">Reset Password</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>
                {error && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                {success ? (
                    <div className="text-center">
                        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
                            Password reset instructions have been sent to your email address.
                        </div>
                        <Link
                            to="/login"
                            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Reset Password
                            </button>
                            <Link
                                to="/login"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordForm; 