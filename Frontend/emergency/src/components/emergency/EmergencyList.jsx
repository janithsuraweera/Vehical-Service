import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye, FaEyeSlash, FaMapMarkerAlt, FaMoon, FaSun } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmergencyList = () => {
    const navigate = useNavigate();
    const [emergencyItems, setEmergencyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filteredEmergency, setFilteredEmergency] = useState([]);
    const [showRequestNo, setShowRequestNo] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

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
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        document.documentElement.classList.toggle('dark', savedDarkMode);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/api/emergency');
            if (response.data && Array.isArray(response.data)) {
                setEmergencyItems(response.data);
                setFilteredEmergency(response.data);
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (error) {
            console.error("Error fetching emergency items:", error);
            setError(error.message || "Failed to load emergency list");
            toast.error("Failed to load emergency list. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (emergencyItems.length > 0) {
            let filtered = [...emergencyItems];

            if (searchTerm) {
                filtered = filtered.filter(item =>
                    (item.vehicleNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (item.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (item.contactNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
                await axios.delete(`http://localhost:5000/api/emergency/${id}`);
                toast.success('Emergency request deleted successfully');
                await fetchData();
            } catch (error) {
                console.error('Error deleting emergency request:', error);
                toast.error('Failed to delete emergency request');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-emergency/${id}`);
    };

    const handleDownload = () => {
        try {
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.text('Emergency Service Report', 105, 20, { align: 'center' });
            
            // Add date
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
            
            // Add company info
            doc.setFontSize(14);
            doc.text('Vehicle Service Center', 105, 40, { align: 'center' });
            
            // Add table
            const tableData = filteredEmergency.map(item => [
                item.emergencyRequestNo || 'N/A',
                item.customerName || 'N/A',
                item.contactNumber || 'N/A',
                item.vehicleNumber || 'N/A',
                typeof item.location === 'object' 
                    ? item.location.address || 'N/A'
                    : item.location || 'N/A',
                item.status || 'N/A',
                item.date ? new Date(item.date).toLocaleDateString() : 'N/A'
            ]);

            autoTable(doc, {
                startY: 50,
                head: [['Request No', 'Name', 'Contact', 'Vehicle No', 'Location', 'Status', 'Date']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [34, 139, 34], // Green color
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 25 }, // Request No
                    1: { cellWidth: 40 }, // Name
                    2: { cellWidth: 30 }, // Contact
                    3: { cellWidth: 30 }, // Vehicle No
                    4: { cellWidth: 50 }, // Location
                    5: { cellWidth: 25 }, // Status
                    6: { cellWidth: 25 }  // Date
                }
            });

            // Add summary
            const finalY = doc.lastAutoTable.finalY || 50;
            doc.setFontSize(12);
            doc.text('Summary', 14, finalY + 20);
            
            const totalRequests = filteredEmergency.length;
            const pendingRequests = filteredEmergency.filter(item => item.status === 'pending').length;
            const processingRequests = filteredEmergency.filter(item => item.status === 'Processing').length;
            const completedRequests = filteredEmergency.filter(item => item.status === 'completed').length;
            
            doc.setFontSize(10);
            doc.text(`Total Requests: ${totalRequests}`, 14, finalY + 30);
            doc.text(`Pending Requests: ${pendingRequests}`, 14, finalY + 40);
            doc.text(`Processing Requests: ${processingRequests}`, 14, finalY + 50);
            doc.text(`Completed Requests: ${completedRequests}`, 14, finalY + 60);
            
            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            }

            // Save the PDF
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            doc.save(`Emergency_Report_${formattedDate}.pdf`);
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
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
                            >
                                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative group">
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                                    }`}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-blue-500 transition-colors duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle Type</label>
                                <select
                                    value={vehicleTypeFilter}
                                    onChange={(e) => setVehicleTypeFilter(e.target.value)}
                                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                                    }`}
                                >
                                    {vehicleTypeOptions.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-blue-500 transition-colors duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-200'
                                    }`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-blue-500 transition-colors duration-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={resetFilters}
                                className={`bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                <FaFilter className="mr-2" /> Reset Filters
                            </button>
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
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Photos</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Contact</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-48">Address</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Vehicle Type</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Color</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Emergency Type</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-64">Description</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Vehicle No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                                    {filteredEmergency.map((item) => (
                                        <tr key={item._id} className={`transition-colors duration-200 group ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                {showRequestNo ? (item.emergencyRequestNo || 'N/A') : ' '}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    {item.photos && item.photos.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.photos.map((photo, index) => (
                                                                <div key={index} className="relative group">
                                                                    <img
                                                                        src={photo}
                                                                        alt={`Emergency photo ${index + 1}`}
                                                                        className="w-12 h-12 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110"
                                                                        onClick={() => window.open(photo, '_blank')}
                                                                        onError={(e) => {
                                                                            console.error('Error loading image:', photo);
                                                                            e.target.src = '/error-image.png';
                                                                            e.target.onerror = null;
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'} italic`}>No photos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                <Link to={`/emergency/${item._id}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline group-hover:text-blue-700 transition-colors duration-200`}>
                                                    {item.name || item.customerName || 'N/A'}
                                                </Link>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>{item.contactNumber || 'N/A'}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>
                                                <div className="flex items-center space-x-2">
                                                    {typeof item.location === 'object' 
                                                        ? (
                                                            <div className="flex items-center space-x-2">
                                                                <span>{item.location.address || 'N/A'}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location.address)}`;
                                                                        window.open(url, '_blank');
                                                                    }}
                                                                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 group/map`}
                                                                >
                                                                    <FaMapMarkerAlt className="w-4 h-4 group-hover/map:scale-110 transition-transform duration-200" />
                                                                </button>
                                                            </div>
                                                        )
                                                        : (
                                                            <div className="flex items-center space-x-2">
                                                                <span>{item.location || 'N/A'}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
                                                                        window.open(url, '_blank');
                                                                    }}
                                                                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 group/map`}
                                                                >
                                                                    <FaMapMarkerAlt className="w-4 h-4 group-hover/map:scale-110 transition-transform duration-200" />
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>{item.vehicleType || 'N/A'}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border ${darkMode ? 'border-gray-500 group-hover:border-gray-400' : 'border-gray-200 group-hover:border-gray-300'} transition-colors duration-200`}
                                                        style={{ backgroundColor: item.vehicleColor }}
                                                    ></div>
                                                    <span>{item.vehicleColor || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>{item.emergencyType || 'N/A'}</td>
                                            <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>
                                                {item.description || item.issueDescription || 'N/A'}
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
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>{item.vehicleNumber || 'N/A'}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>
                                                {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} group-hover:text-gray-700 transition-colors duration-200`}>{item.time || 'N/A'}</td>
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
        </div>
    );
};

export default EmergencyList;