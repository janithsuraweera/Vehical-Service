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

    // --- PDF Download Function Modification ---
    const handleDownload = () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = '/logo.png'; // Ensure this path is correct relative to your public folder or server setup

        img.onload = () => {
            try {
                doc.addImage(img, 'PNG', 10, 10, 30, 30);
            } catch (e) {
                console.error("Error adding image to PDF:", e);
                toast.warn("Could not add logo to the report.");
            }
            doc.setFontSize(18);
            doc.text('Emergency Report', 50, 25);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 32);

            const head = [[
                'Name', 'Contact Number', 'Address', 'Vehicle Type',
                'Vehicle Color', // Index 4
                'Emergency Type', 'Description', 'Status',
                'Vehicle Number', 'Date', 'Time'
            ]];

            const body = filteredEmergencies.map(emergency => {

                const vehicleColorCell = {
                    content: '', // Or you can put emergency.vehicleColor here if you want the text too
                    styles: {
                        fillColor: emergency.vehicleColor // This sets the background color of the cell
                    }
                };
                 // --- MODIFICATION END ---

                return [
                    emergency.name,
                    emergency.contactNumber,
                    emergency.location?.address || 'N/A',
                    emergency.vehicleType,
                    vehicleColorCell, // Use the styled cell object here instead of just the string
                    emergency.emergencyType,
                    emergency.description,
                    emergency.status,
                    emergency.vehicleNumber,
                    emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A',
                    emergency.time
                ];
            });

            autoTable(doc, {
                startY: 45,
                head: head,
                body: body, // Use the modified body array
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

        img.onerror = () => {
            console.error("Logo image could not be loaded for PDF generation.");
            toast.error("Failed to load logo. Report will be generated without it.");
            // Fallback: Generate PDF without the logo
            doc.setFontSize(18);
            doc.text('Emergency Report', 10, 25); // Adjusted position without logo
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 32); // Adjusted position

            const head = [[ /* ... same head definition ... */
                 'Name', 'Contact Number', 'Address', 'Vehicle Type',
                'Vehicle Color', // Index 4
                'Emergency Type', 'Description', 'Status',
                'Vehicle Number', 'Date', 'Time'
            ]];
            const body = filteredEmergencies.map(emergency => { /* ... same body generation with styled cell ... */
                 const vehicleColorCell = {
                    content: '',
                    styles: { fillColor: emergency.vehicleColor }
                };
                return [
                     emergency.name, emergency.contactNumber, emergency.location?.address || 'N/A',
                     emergency.vehicleType, vehicleColorCell, emergency.emergencyType,
                     emergency.description, emergency.status, emergency.vehicleNumber,
                     emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A', emergency.time
                 ];
             });

            autoTable(doc, {
                startY: 40, // Adjusted startY
                head: head,
                body: body,
                theme: 'striped',
                styles: { fontSize: 8 },
                didDrawPage: (data) => { /* ... same pagination ... */
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
     // --- End of PDF Download Function Modification ---

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-10 text-center text-indigo-700">Emergency List</h2>

                {/* Filter and Search Controls */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                     <div className="flex flex-wrap gap-2">
                        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="p-2 border rounded">
                            <option value="">All Vehicle Types</option>
                            <option value="car">Car</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bus">Bus</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
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

                 {/* Table Display */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Request No</th>
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
                            {filteredEmergencies.map((emergency) => (
                                <tr key={emergency._id} className="hover:bg-red-50 text-sm">
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.emergencyRequestNo}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">
                                        <Link to={`/emergency/${emergency._id}`} className="text-black-600 hover:underline">
                                            {emergency.name}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.contactNumber}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.location?.address || 'N/A'}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.vehicleType}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">
                                      
                                        {/* Color display in table */}
                                        <div
                                            className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto" // Centered the circle
                                            style={{
                                                backgroundColor: emergency.vehicleColor,
                                                border: '1px solid #ccc',
                                            }}
                                            title={emergency.vehicleColor} // Show color code on hover
                                        ></div>
                                    </td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.emergencyType}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.description}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.status}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.vehicleNumber}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.date ? new Date(emergency.date).toLocaleDateString() : 'N/A'}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">{emergency.time}</td>
                                    <td className="py-2 px-4 md:py-4 md:px-6 border-b">
                                         {/* Action Buttons */}
                                        <div className="flex flex-col md:flex-row gap-1 md:space-x-2">
                                           <button onClick={() => handleUpdate(emergency._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 md:py-2 md:px-3 rounded text-xs md:text-sm flex items-center justify-center">
                                                <FaEdit className="inline-block mr-1" /> Update
                                            </button>
                                            <button onClick={() => handleDelete(emergency._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 md:py-2 md:px-3 rounded text-xs md:text-sm flex items-center justify-center">
                                                <FaTrash className="inline-block mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Buttons */}
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                    <button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center">
                        <FaArrowLeft className="mr-2" /> Back to Login
                    </button>
                    <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center">
                        <FaDownload className="mr-2" /> Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyList;