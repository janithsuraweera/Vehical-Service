import React from 'react';
import { Link } from 'react-router-dom';


const EmergencyHomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-10 text-blue-700">Welcome!</h1>
                <div className="space-y-6 mb-10">
                    <Link to="/login" className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Login
                    </Link>
                    <Link to="/signup" className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                        Sign Up
                    </Link>
                </div>
                <Link to="/emergencyform" className="block w-full py-4 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg">
                    Emergency Form
                </Link>

                <Link
                        to="/emergencylist" // Replace with your EmergencyList route
                         className="mt-4  bg-green-500  hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                        // className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                    >
                         Admin View
                    </Link>

            </div>
        </div>
    );
};

export default EmergencyHomePage;