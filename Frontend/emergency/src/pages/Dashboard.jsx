import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Vehicle Service Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-600">Welcome, {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dashboard Cards */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h3 className="text-lg font-medium text-gray-900">Emergency Services</h3>
                                <p className="mt-1 text-sm text-gray-500">View and manage emergency service requests</p>
                                <button
                                    onClick={() => navigate('/emergency')}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    View Emergencies
                                </button>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h3 className="text-lg font-medium text-gray-900">Vehicle Registration</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage vehicle registration requests</p>
                                <button
                                    onClick={() => navigate('/vehicle-registration')}
                                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    View Registrations
                                </button>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage service inventory and parts</p>
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                                >
                                    View Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 