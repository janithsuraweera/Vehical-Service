import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmergencyList = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/emergency');
                setEmergencies(response.data);
            } catch (error) {
                console.error("Error fetching emergencies:", error);
                toast.error("Failed to load emergency list.");
            }
        };
        fetchEmergencies();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this emergency?")) {
            try {
                await axios.delete(`http://localhost:5000/api/emergency/${id}`);
                setEmergencies(emergencies.filter(emergency => emergency._id !== id));
                toast.success("Emergency deleted successfully!");
            } catch (error) {
                console.error("Error deleting emergency:", error);
                toast.error("Failed to delete emergency.");
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-emergency/${id}`);
    };

    const handleBack = () => {
        navigate('/login');
    };

    const filteredEmergencies = emergencies.filter(emergency => {
        const searchMatch = emergency.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emergency.name.toLowerCase().includes(searchTerm.toLowerCase());
        const vehicleMatch = vehicleFilter ? emergency.vehicleType === vehicleFilter : true;
        const dateMatch = dateFilter ? new Date(emergency.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() : true;
        const statusMatch = statusFilter ? emergency.status === statusFilter : true;
        return searchMatch && vehicleMatch && dateMatch && statusMatch;
    });

    const handleDownload = () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = '/logo.png'; 
        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 30, 30);
            doc.setFontSize(18);
            doc.text('Emergency Report', 50, 25);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 32);

            autoTable(doc, {
                startY: 45,
                head: [[
                    'Name', 'Contact Number', 'Address', 'Vehicle Type',
                    'Vehicle Color', 'Emergency Type', 'Description', 'Status',
                    'Vehicle Number', 'Date', 'Time'
                ]],
                body: filteredEmergencies.map(emergency => [
                    emergency.name,
                    emergency.contactNumber,
                    emergency.location?.address || 'N/A',
                    emergency.vehicleType,
                    emergency.vehicleColor,
                    emergency.emergencyType,
                    emergency.description,
                    emergency.status,
                    emergency.vehicleNumber,
                    emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A',
                    emergency.time
                ]),
                theme: 'striped',
                styles: { fontSize: 8 },
                didDrawPage: (data) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(9);
                    doc.text(
                        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
                        data.settings.margin.left,
                        doc.internal.pageSize.height - 10
                    );
                }
            });

            doc.save('emergency_report.pdf');
        };
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-10 text-center text-indigo-700">Emergency List</h2>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="p-2 border rounded">
                            <option value="">All Vehicle Types</option>
                            <option value="car">Car</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bus">Bus</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded ml-2" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded ml-2">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Vehicle Number or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                {[
                                    'Name', 'Contact Number', 'Address', 'Vehicle Type', 'Vehicle Color',
                                    'Emergency Type', 'Description', 'Status', 'Vehicle Number', 'Date', 'Time', 'Actions'
                                ].map((header, i) => (
                                    <th key={i} className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmergencies.map((emergency) => (
                                <tr key={emergency._id} className="hover:bg-red-50">
                                    <td className="py-4 px-6 border-b">
                                        <Link to={`/emergency/${emergency._id}`} className="text-black-600 hover:none">
                                            {emergency.name}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6 border-b">{emergency.contactNumber}</td>
                                    <td className="py-4 px-6 border-b">{emergency.location?.address}</td>
                                    <td className="py-4 px-6 border-b">{emergency.vehicleType}</td>
                                    <td className="py-4 px-6 border-b">{emergency.vehicleColor}</td>
                                    <td className="py-4 px-6 border-b">{emergency.emergencyType}</td>
                                    <td className="py-4 px-6 border-b">{emergency.description}</td>
                                    <td className="py-4 px-6 border-b">{emergency.status}</td>
                                    <td className="py-4 px-6 border-b">{emergency.vehicleNumber}</td>
                                    <td className="py-4 px-6 border-b">{emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A'}</td>
                                    <td className="py-4 px-6 border-b">{emergency.time}</td>
                                    <td className="py-4 px-6 border-b flex space-x-2">
                                        <button onClick={() => handleUpdate(emergency._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded">
                                            <FaEdit className="inline-block mr-1" /> Update
                                        </button>
                                        <button onClick={() => handleDelete(emergency._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded">
                                            <FaTrash className="inline-block mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between mt-6">
                    <button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg">
                        <FaArrowLeft className="mr-2" /> Back to Login
                    </button>
                    <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
                        <FaDownload className="mr-2" /> Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyList;
