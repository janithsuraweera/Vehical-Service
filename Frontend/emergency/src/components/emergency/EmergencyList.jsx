import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaDownload, FaEye, FaEyeSlash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmergencyList = () => {
    const navigate = useNavigate();
    const [emergencyItems, setEmergencyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredEmergency, setFilteredEmergency] = useState([]);
    const [showRequestNo, setShowRequestNo] = useState(false);

    // Define status options
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

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

            setFilteredEmergency(filtered);
        }
    }, [emergencyItems, searchTerm, statusFilter]);

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
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            Emergency Service Management
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRequestNo(!showRequestNo)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {showRequestNo ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
                                {showRequestNo ? 'Hide Request No' : 'Show Request No'}
                            </button>
                            <Link 
                                to="/emergency-form" 
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <FaPlus className="mr-2" /> Add New Request
                            </Link>
                            <button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <FaDownload className="mr-2" /> Download Report
                            </button>
                        </div>
                    </div>

                    <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex-1 min-w-[250px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by vehicle no., name or contact..."
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                    <FaSearch className="absolute left-4 top-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-[250px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={resetFilters}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <FaFilter className="mr-2" /> Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="text-center py-12 bg-red-50 rounded-xl shadow-lg">
                            <p className="text-red-600 text-lg">{error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-gray-600 text-lg">Loading emergency requests...</p>
                        </div>
                    ) : filteredEmergency.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-600 text-lg">No emergency requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <tr>
                                        {showRequestNo && (
                                            <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Request No</th>
                                        )}
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Photos</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Contact</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Address</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Vehicle Type</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Color</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Emergency Type</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Description</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Vehicle No</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Date</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Time</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmergency.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                                            {showRequestNo && (
                                                <td className="px-8 py-4 whitespace-nowrap text-gray-900 font-medium">{item.emergencyRequestNo || 'N/A'}</td>
                                            )}
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    {item.photos && item.photos.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.photos.map((photo, index) => (
                                                                <div key={index} className="relative group">
                                                                    <img
                                                                        src={photo}
                                                                        alt={`Emergency photo ${index + 1}`}
                                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110"
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
                                                        <span className="text-gray-400 italic">No photos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900 font-medium">
                                                <Link to={`/emergency/${item._id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                    {item.name || item.customerName || 'N/A'}
                                                </Link>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">{item.contactNumber || 'N/A'}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">
                                                {typeof item.location === 'object' 
                                                    ? item.location.address || 'N/A'
                                                    : item.location || 'N/A'}
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">{item.vehicleType || 'N/A'}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: item.vehicleColor }}
                                                    ></div>
                                                    <span>{item.vehicleColor || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">{item.emergencyType || 'N/A'}</td>
                                            <td className="px-8 py-4 text-gray-900">
                                                {item.description || item.issueDescription || 'N/A'}
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    item.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">{item.vehicleNumber || 'N/A'}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">
                                                {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-900">{item.time || 'N/A'}</td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <FaEdit className="mr-2" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <FaTrash className="mr-2" /> Delete
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