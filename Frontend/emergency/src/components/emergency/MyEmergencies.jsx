import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye, FaEyeSlash, FaMapMarkerAlt, FaImages, FaTimes } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyEmergencies = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const [emergencyItems, setEmergencyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filteredEmergency, setFilteredEmergency] = useState([]);
    const [showRequestNo, setShowRequestNo] = useState(false);
    const [showAddress, setShowAddress] = useState(true);
    const [selectedPhotos, setSelectedPhotos] = useState(null);

    // Define status options
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    // Define vehicle type options
    const vehicleTypeOptions = [
        { value: '', label: 'All Vehicle Types' },
        { value: 'car', label: 'Car' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'bus', label: 'Bus' },
        { value: 'truck', label: 'Truck' },
        { value: 'van', label: 'Van' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        const fetchUserEmergencies = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to view your emergency requests');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/emergency/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log('Response from server:', response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setEmergencyItems(response.data);
                    setFilteredEmergency(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid response format from server');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user emergencies:', error);
                if (error.response) {
                    if (error.response.status === 401) {
                        setError('Please log in to view your emergency requests');
                    } else if (error.response.status === 404) {
                        setError('No emergency requests found');
                    } else {
                        setError(error.response.data.message || 'Failed to load emergency requests');
                    }
                } else {
                    setError('Failed to connect to the server. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchUserEmergencies();
    }, []);

    useEffect(() => {
        let filtered = [...emergencyItems];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.emergencyType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Apply vehicle type filter
        if (vehicleTypeFilter) {
            filtered = filtered.filter(item => item.vehicleType === vehicleTypeFilter);
        }

        // Apply date filter
        if (dateFilter) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
                return itemDate === dateFilter;
            });
        }

        setFilteredEmergency(filtered);
    }, [searchTerm, statusFilter, vehicleTypeFilter, dateFilter, emergencyItems]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this emergency request?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/emergency/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmergencyItems(emergencyItems.filter(item => item._id !== id));
                toast.success('Emergency request deleted successfully');
            } catch (error) {
                console.error('Error deleting emergency request:', error);
                toast.error('Failed to delete emergency request');
            }
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('My Emergency Requests', 14, 22);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        
        // Add table
        autoTable(doc, {
            startY: 35,
            head: [['Name', 'Vehicle No', 'Type', 'Status', 'Date']],
            body: filteredEmergency.map(item => [
                item.name || 'N/A',
                item.vehicleNumber || 'N/A',
                item.emergencyType || 'N/A',
                item.status || 'N/A',
                new Date(item.createdAt).toLocaleDateString()
            ]),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 10 }
        });
        
        doc.save('my-emergency-requests.pdf');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="w-full h-full">
                <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${darkMode ? 'bg-gray-800' : 'bg-white bg-opacity-90'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text'}`}>
                            My Emergency Requests
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/emergencyform')}
                                className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                <span className="mr-2">New Request</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-2 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 group w-10 hover:w-40 overflow-hidden`}
                            >
                                <FaDownload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="absolute opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-5 whitespace-nowrap">
                                    Download Report
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className={`mb-6 p-4 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={vehicleTypeFilter}
                                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                                className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            >
                                {vehicleTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Request No
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Vehicle No
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredEmergency.map((item) => (
                                    <tr key={item._id} className={`group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}>
                                        <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {showRequestNo ? (item.emergencyRequestNo || 'N/A') : ' '}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {item.name || 'N/A'}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {item.contactNumber || 'N/A'}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {item.vehicleNumber || 'N/A'}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {item.emergencyType || 'N/A'}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/emergency/${item._id}`)}
                                                    className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/update-emergency/${item._id}`)}
                                                    className="p-2 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEmergencies; 