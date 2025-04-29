import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload, FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const EmergencyList = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/emergency');
                console.log('Fetched emergencies:', response.data);
                const sortedEmergencies = response.data.sort((a, b) => {
                    const dateA = a.date ? new Date(a.date) : 0;
                    const dateB = b.date ? new Date(b.date) : 0;
                    return dateB - dateA;
                });
                setEmergencies(sortedEmergencies);
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

    const handleDownload = () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = '/logo.png';

        const generatePdf = () => {
            doc.setFontSize(18);
            doc.text('Emergency Report', 50, 25);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 32);

            const head = [['Name', 'Contact Number', 'Address', 'Vehicle Type', 'Vehicle Color', 'Emergency Type', 'Description', 'Status', 'Vehicle Number', 'Date', 'Time']];
            const body = filteredEmergencies.map(emergency => [emergency.name, emergency.contactNumber, emergency.location?.address || 'N/A', emergency.vehicleType, emergency.vehicleColor, emergency.emergencyType, emergency.description, emergency.status, emergency.vehicleNumber, emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A', emergency.time]);

            autoTable(doc, {
                startY: 45,
                head: head,
                body: body,
                theme: 'striped',
                styles: { fontSize: 7, cellPadding: 2 },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) {
                        const color = data.cell.raw;
                        const cell = data.cell;
                        const doc = data.doc;

                        if (color && typeof color === 'string') {
                            const bgColor = data.row.index % 2 === 0 ? [255, 255, 255] : [245, 245, 245];
                            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                            doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');

                            const squareSize = 6;
                            const rectX = cell.x + (cell.width - squareSize) / 2;
                            const rectY = cell.y + (cell.height - squareSize) / 2;

                            try {
                                doc.setFillColor(color);
                                doc.rect(rectX, rectY, squareSize, squareSize, 'F');
                                doc.setDrawColor(0); doc.setLineWidth(0.1);
                                doc.rect(rectX, rectY, squareSize, squareSize, 'S');
                            } catch (e) {
                                console.warn(`PDF Draw Error: Invalid color '${color}'?`, e);
                                doc.setTextColor(150); doc.setFontSize(6);
                                doc.text('?', cell.x + cell.width / 2, cell.y + cell.height / 2, { align: 'center', baseline: 'middle' });
                                doc.setTextColor(0);
                            }
                            doc.setDrawColor(0);
                        } else {
                            const bgColor = data.row.index % 2 === 0 ? [255, 255, 255] : [245, 245, 245];
                            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                            doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
                        }
                    }
                },
                didDrawPage: (data) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(9);
                    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
                }
            });
        };

        img.onload = () => {
            try {
                doc.addImage(img, 'PNG', 10, 10, 30, 30);
            } catch (e) {
                console.error("Error adding image to PDF:", e);
                toast.warn("Could not add logo to the report.");
            }
            generatePdf();
        };

        img.onerror = () => {
            console.error("Logo image could not be loaded for PDF generation.");
            toast.error("Failed to load logo. Report will be generated without it.");
            generatePdf();
        };

        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const fileName = `Emergency Report (${formattedDate}).pdf`;

        img.onload();
        doc.save(fileName);
    };

    const filteredEmergencies = emergencies.filter(emergency => {
        const searchMatch = emergency.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || emergency.name.toLowerCase().includes(searchTerm.toLowerCase());
        const vehicleMatch = vehicleFilter ? emergency.vehicleType === vehicleFilter : true;
        const dateMatch = dateFilter ? (emergency.date && new Date(emergency.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()) : true;
        const statusMatch = statusFilter ? emergency.status === statusFilter : true;
        return searchMatch && vehicleMatch && dateMatch && statusMatch;
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-10 text-center text-indigo-700">Emergency List</h2>

                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="flex flex-wrap gap-2">
                        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200">
                            <option value="">All Vehicle Types</option>
                            <option value="car">Car</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bus">Bus</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by Vehicle Number or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-3 pl-10 border border-gray-300 rounded-lg w-full bg-white shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Request No</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Photos</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Name</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Contact</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Address</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Vehicle Type</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Color</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Emergency Type</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Description</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Vehicle No</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Time</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmergencies.length > 0 ? (
                                filteredEmergencies.map((emergency) => {
                                    console.log('Rendering emergency:', emergency);
                                    console.log('Emergency photos:', emergency.photos);
                                    return (
                                        <tr key={emergency._id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.emergencyRequestNo}</td>
                                            <td className="py-3 px-4 md:px-6 border-b">
                                                <div className="flex space-x-2">
                                                    {emergency.photos && emergency.photos.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {emergency.photos.map((photo, index) => {
                                                                console.log('Rendering photo:', photo);
                                                                return (
                                                                    <div key={index} className="relative group">
                                                                        <img
                                                                            src={photo}
                                                                            alt={`Emergency photo ${index + 1}`}
                                                                            className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110"
                                                                            onClick={() => window.open(photo, '_blank')}
                                                                            onError={(e) => {
                                                                                console.error('Error loading image:', photo);
                                                                                e.target.src = 'https://via.placeholder.com/64?text=Error';
                                                                            }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No photos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">
                                                <Link to={`/emergency/${emergency._id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                    {emergency.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.contactNumber}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.location?.address || 'N/A'}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.vehicleType}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: emergency.vehicleColor }}
                                                    ></div>
                                                    <span>{emergency.vehicleColor}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.emergencyType}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.description}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    emergency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    emergency.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {emergency.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.vehicleNumber || 'N/A'}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">
                                                {emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">{emergency.time}</td>
                                            <td className="py-3 px-4 md:px-6 border-b text-sm md:text-base">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdate(emergency._id)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                        title="Update"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(emergency._id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="14" className="text-center py-4 text-gray-500">
                                        No matching emergencies found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                    <button
                        onClick={handleBack}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center"
                        title="Back to Login"
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center"
                        title="Download"
                    >
                        <FaDownload />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyList;