import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationHomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-10 text-purple-700">Get Started!</h1>
                <div className="space-y-6 mb-10">
                    {/* <Link to="/register-user" className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Register User
                    </Link> */}
                    <Link to="/registrationform" className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                        Register Vehicle
                    </Link>
                </div>
                <Link to="/view-registrations" className="block w-full py-4 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg">
                    View Registrations
                </Link>
                <Link
                    to="/admin-dashboard"
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                >
                    Admin Dashboard
                </Link>
            </div>
        </div>
    );
};

export default RegistrationHomePage;
//