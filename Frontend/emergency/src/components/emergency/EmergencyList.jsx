import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye, FaEyeSlash, FaMapMarkerAlt, FaImages, FaTimes } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const EmergencyList = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const { user } = useAuth();
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
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view emergency requests');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/emergency', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEmergencyItems(response.data);
            setFilteredEmergency(response.data);
        } catch (error) {
            console.error('Error fetching emergency requests:', error);
            if (error.response?.status === 401) {
                setError('Please log in to view emergency requests');
            } else {
                setError('Failed to load emergency requests. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (emergencyItems.length > 0) {
            let filtered = [...emergencyItems];

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filtered = filtered.filter(item =>
                    (item.vehicleNumber?.toLowerCase() || '').includes(searchLower) ||
                    (item.customerName?.toLowerCase() || '').includes(searchLower) ||
                    (item.contactNumber?.toString() || '').includes(searchLower) ||
                    (item.name?.toLowerCase() || '').includes(searchLower)
                );
            }

            if (statusFilter) {
                filtered = filtered.filter(item => item.status === statusFilter);
            }

            if (vehicleTypeFilter) {
                filtered = filtered.filter(item => item.vehicleType === vehicleTypeFilter);
            }

            if (dateFilter) {
                filtered = filtered.filter(item => {
                    const itemDate = new Date(item.date).toLocaleDateString();
                    const filterDate = new Date(dateFilter).toLocaleDateString();
                    return itemDate === filterDate;
                });
            }

            setFilteredEmergency(filtered);
        }
    }, [emergencyItems, searchTerm, statusFilter, vehicleTypeFilter, dateFilter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this emergency request?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please log in to delete emergency requests');
                    return;
                }

                await axios.delete(`http://localhost:5000/api/emergency/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Emergency request deleted successfully');
                await fetchData();
            } catch (error) {
                console.error('Error deleting emergency request:', error);
                if (error.response?.status === 401) {
                    toast.error('Please log in to delete emergency requests');
                } else {
                    toast.error('Failed to delete emergency request');
                }
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-emergency/${id}`);
    };

    const handleDownload = () => {
        try {
            const doc = new jsPDF();
            
            // Add company logo and header
            doc.setFontSize(24);
            doc.setTextColor(0, 48, 135); // Dark blue color
            doc.text('Vehicle Service Center', 105, 20, { align: 'center' });
            
            // Add subtitle
            doc.setFontSize(16);
            doc.setTextColor(231, 76, 60); // Red color
            doc.text('Emergency Service Report', 105, 30, { align: 'center' });
            
            // Add report info
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 15, 40);
            doc.text(`Generated Time: ${new Date().toLocaleTimeString()}`, 15, 45);
            doc.text(`Total Requests: ${filteredEmergency.length}`, 15, 50);

            // Add status summary
            const pendingCount = filteredEmergency.filter(item => item.status === 'pending').length;
            const processingCount = filteredEmergency.filter(item => item.status === 'Processing').length;
            const completedCount = filteredEmergency.filter(item => item.status === 'completed').length;

            doc.setFontSize(12);
            doc.setTextColor(0, 48, 135); // Dark blue color
            doc.text('Status Summary:', 150, 40);
            doc.setFontSize(10);
            doc.setTextColor(243, 156, 18); // Orange color for pending
            doc.text(`Pending: ${pendingCount}`, 150, 45);
            doc.setTextColor(231, 76, 60); // Red color for processing
            doc.text(`Processing: ${processingCount}`, 150, 50);
            doc.setTextColor(46, 204, 113); // Green color for completed
            doc.text(`Completed: ${completedCount}`, 150, 55);

            // Add table
            const tableData = filteredEmergency.map(item => [
                item.emergencyRequestNo || 'N/A',
                item.name || item.customerName || 'N/A',
                item.contactNumber || 'N/A',
                typeof item.location === 'object' ? item.location.address || 'N/A' : item.location || 'N/A',
                item.vehicleNumber || 'N/A',
                item.emergencyType || 'N/A',
                item.vehicleType || 'N/A',
                item.vehicleColor || 'N/A',
                item.description || item.issueDescription || 'N/A',
                item.status || 'N/A',
                item.date ? new Date(item.date).toLocaleDateString() : 'N/A',
                item.time || 'N/A'
            ]);

            // Define the table headers and styles
            autoTable(doc, {
                startY: 65,
                head: [[
                    'Request No',
                    'Name',
                    'Contact',
                    'Location',
                    'Vehicle No',
                    'Emergency',
                    'Vehicle Type',
                    'Color',
                    'Description',
                    'Status',
                    'Date',
                    'Time'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 48, 135],
                    textColor: 255,
                    fontSize: 8,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 8,
                    textColor: 50,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 20 }, // Request No
                    1: { cellWidth: 25 }, // Name
                    2: { cellWidth: 20 }, // Contact
                    3: { cellWidth: 35 }, // Location
                    4: { cellWidth: 20 }, // Vehicle No
                    5: { cellWidth: 20 }, // Emergency
                    6: { cellWidth: 20 }, // Vehicle Type
                    7: { cellWidth: 15 }, // Color
                    8: { cellWidth: 35 }, // Description
                    9: { cellWidth: 15, 
                         fontStyle: 'bold',
                         customFunction: (cell, data) => {
                             if (data.text[0] === 'pending') {
                                 cell.styles.textColor = [243, 156, 18]; // Orange
                             } else if (data.text[0] === 'Processing') {
                                 cell.styles.textColor = [231, 76, 60]; // Red
                             } else if (data.text[0] === 'completed') {
                                 cell.styles.textColor = [46, 204, 113]; // Green
                             }
                         }
                    }, // Status
                    10: { cellWidth: 20 }, // Date
                    11: { cellWidth: 15 }  // Time
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                },
                margin: { top: 65, right: 15, bottom: 30, left: 15 },
                didDrawPage: (data) => {
                    // Add footer on each page
                    doc.setFontSize(8);
                    doc.setTextColor(128);
                    doc.text(
                        'Vehicle Service Center - Emergency Service Report',
                        data.settings.margin.left,
                        doc.internal.pageSize.height - 10
                    );
                    doc.text(
                        `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
                        doc.internal.pageSize.width - data.settings.margin.right,
                        doc.internal.pageSize.height - 10,
                        { align: 'right' }
                    );
                }
            });

            // Save the PDF
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            doc.save(`Emergency_Service_Report_${timestamp}.pdf`);
            
            toast.success('Report generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF report. Please try again.');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setVehicleTypeFilter('');
        setDateFilter('');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} p-4`}>
            <div className="w-full h-full">
                <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${darkMode ? 'bg-gray-800' : 'bg-white bg-opacity-90'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text'}`}>
                            Emergency Service Management
                        </h2>
                        <div className="flex gap-4">
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
                        <div className="relative group mb-4">
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by vehicle no., name or contact..."
                                    className={`w-full pl-12 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-200'
                                    }`}
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <FaSearch className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-blue-500 transition-colors duration-300`} />
                                </div>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)} 
                                    className={`w-48 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Vehicle Type</label>
                                <select 
                                    value={vehicleTypeFilter} 
                                    onChange={(e) => setVehicleTypeFilter(e.target.value)} 
                                    className={`w-48 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                                >
                                    <option value="">All Vehicle Types</option>
                                    <option value="car">Car</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="bus">Bus</option>
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                                <input 
                                    type="date" 
                                    value={dateFilter} 
                                    onChange={(e) => setDateFilter(e.target.value)} 
                                    className={`w-48 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                            </div>

                            <div className="flex items-center self-end">
                                <button
                                    onClick={resetFilters}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    <FaFilter className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">Reset Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className={`text-center py-8 rounded-xl shadow-lg ${darkMode ? 'bg-red-900/50' : 'bg-red-50'}`}>
                            <p className={`${darkMode ? 'text-red-300' : 'text-red-600'} text-lg`}>{error}</p>
                            <button
                                onClick={fetchData}
                                className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg`}
                            >
                                Retry
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-8">
                            <div className={`animate-spin rounded-full h-12 w-12 border-4 ${darkMode ? 'border-blue-400' : 'border-blue-500'} border-t-transparent mx-auto`}></div>
                            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Loading emergency requests...</p>
                        </div>
                    ) : filteredEmergency.length === 0 ? (
                        <div className={`text-center py-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>No emergency requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-lg">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-24">
                                            <div className="flex items-center gap-2">
                                                Request No
                                                <button
                                                    onClick={() => setShowRequestNo(!showRequestNo)}
                                                    className="text-white hover:text-gray-200 transition-colors duration-200"
                                                >
                                                    {showRequestNo ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Contact</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-48">
                                            <div className="flex items-center gap-2">
                                                Address
                                                <button
                                                    onClick={() => setShowAddress(!showAddress)}
                                                    className="text-white hover:text-gray-200 transition-colors duration-200"
                                                >
                                                    {showAddress ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Vehicle No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Emergency Type</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Vehicle Type</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Color</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-64">Description</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Photos</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                                    {filteredEmergency.map((item) => (
                                        <tr key={item._id} className={`transition-colors duration-200 group ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {showRequestNo ? (item.emergencyRequestNo || 'N/A') : ' '}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                <Link to={`/emergency/${item._id}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline group-hover:text-blue-700 transition-colors duration-200`}>
                                                    {item.name || item.customerName || 'N/A'}
                                                </Link>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.contactNumber || 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {typeof item.location === 'object' ? (
                                                        <div className={`flex items-center ${showAddress ? 'justify-start' : 'justify-center w-full'} space-x-2`}>
                                                            {showAddress && <span>{item.location.address || 'N/A'}</span>}
                                                            <button
                                                                onClick={() => {
                                                                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location.address)}`;
                                                                    window.open(url, '_blank');
                                                                }}
                                                                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 group/map`}
                                                                title={!showAddress ? item.location.address : ''}
                                                            >
                                                                <FaMapMarkerAlt className="w-5 h-5 group-hover/map:scale-110 transition-transform duration-200" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={`flex items-center ${showAddress ? 'justify-start' : 'justify-center w-full'} space-x-2`}>
                                                            {showAddress && <span>{item.location || 'N/A'}</span>}
                                                            <button
                                                                onClick={() => {
                                                                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
                                                                    window.open(url, '_blank');
                                                                }}
                                                                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 group/map`}
                                                                title={!showAddress ? item.location : ''}
                                                            >
                                                                <FaMapMarkerAlt className="w-5 h-5 group-hover/map:scale-110 transition-transform duration-200" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.vehicleNumber || 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.emergencyType || 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.vehicleType || 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        className={`w-6 h-6 border ${darkMode ? 'border-gray-500' : 'border-gray-300'} cursor-help`}
                                                        style={{ backgroundColor: item.vehicleColor }}
                                                        title={item.vehicleColor || 'N/A'}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.description || item.issueDescription || 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                <div className="flex justify-center items-center">
                                                    {item.photos && item.photos.length > 0 ? (
                                                        <button
                                                            onClick={() => setSelectedPhotos(item.photos)}
                                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                                                darkMode 
                                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700'
                                                            }`}
                                                        >
                                                            <FaImages className="w-4 h-4" />
                                                            <span>See Photos ({item.photos.length})</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 italic">No photos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status === 'pending' ? `${darkMode ? 'bg-yellow-900/50 text-yellow-300 group-hover:bg-yellow-900/70 group-hover:text-yellow-200' : 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:text-yellow-900'} animate-[pulse_1.5s_ease-in-out_infinite]` :
                                                    item.status === 'Processing' ? `${darkMode ? 'bg-red-900/50 text-red-300 group-hover:bg-red-900/70 group-hover:text-red-200' : 'bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900'} animate-[pulse_1.5s_ease-in-out_infinite]` :
                                                    `${darkMode ? 'bg-green-900/50 text-green-300 group-hover:bg-green-900/70 group-hover:text-green-200' : 'bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900'}`
                                                } transition-colors duration-200`}>
                                                    {item.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                                {item.time || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm group/btn"
                                                    >
                                                        <FaEdit className="mr-1 group-hover/btn:rotate-12 transition-transform duration-300" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm group/btn"
                                                    >
                                                        <FaTrash className="mr-1 group-hover/btn:rotate-12 transition-transform duration-300" /> Delete
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/emergency/${item._id}`)}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm group/btn"
                                                    >
                                                        <FaEye className="mr-1 group-hover/btn:rotate-12 transition-transform duration-300" /> View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Photos Modal */}
            {selectedPhotos && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 ${darkMode ? 'dark' : ''}`}>
                        <button
                            onClick={() => setSelectedPhotos(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Emergency Photos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedPhotos.map((photo, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={photo}
                                        alt={`Emergency ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                                        onClick={() => window.open(photo, '_blank')}
                                        onError={(e) => {
                                            console.error('Error loading image:', photo);
                                            e.target.src = 'https://via.placeholder.com/300?text=Error';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyList;