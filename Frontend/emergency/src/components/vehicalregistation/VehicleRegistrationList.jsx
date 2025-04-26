import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload, FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//error fix now
const VehicleRegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vehicle-registration');
                setRegistrations(response.data);
            } catch (error) {
                console.error("Error fetching vehicle registrations:", error);
                toast.error("Failed to load vehicle registration list.");
            }
        };
        fetchRegistrations();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this registration?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicle-registration/${id}`);
                setRegistrations(registrations.filter(registration => registration._id !== id));
                toast.success("Vehicle registration deleted successfully!");
            } catch (error) {
                console.error("Error deleting vehicle registration:", error);
                toast.error("Failed to delete vehicle registration.");
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-vehicle-registration/${id}`);
    };

    const handleBack = () => {
        navigate('/rvhome');
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = '/logo.png';

        const generatePdf = () => {
            doc.setFontSize(18);
            doc.text('Vehicle Registration Report', 50, 25);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 32);

            const head = [['Name', 'Customer NIC', 'Vehicle Number', 'Vehicle Type', 'Vehicle Model', 'Vehicle Color']];
            const body = filteredRegistrations.map(registration => [registration.name, registration.customerNIC, registration.vehicleNumber, registration.vehicleType, registration.vehicleModel, registration.vehicleColor]);

            autoTable(doc, {
                startY: 45,
                head: head,
                body: body,
                theme: 'striped',
                styles: { fontSize: 7, cellPadding: 2 },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 5) {
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
        const fileName = `Vehicle Registration Report (${formattedDate}).pdf`;

        img.onload();
        doc.save(fileName);
    };

    const filteredRegistrations = registrations.filter(registration => {
        return registration.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) || registration.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-10 text-center text-indigo-700">Vehicle Registration List</h2>

                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full md:w-auto">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by Vehicle Number or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full pr-20 transition-shadow duration-300 focus:ring focus:ring-indigo-200 focus:shadow-md"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Name</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Customer NIC</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Vehicle Number</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Vehicle Type</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Vehicle Model</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Color</th>
                                <th className="py-3 px-4 md:px-6 border-b text-left text-sm md:text-lg font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.length > 0 ? (
                                filteredRegistrations.map((registration) => (
                                    <tr key={registration._id} className="hover:bg-red-50 text-sm">
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">
                                            <Link to={`/vehicle-registration/${registration._id}`} className="text-black-600 hover:underline">
                                                {registration.name}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">{registration.customerNIC}</td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">{registration.vehicleNumber}</td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">{registration.vehicleType}</td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">{registration.vehicleModel}</td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b text-center">
                                            <div
                                                className="w-6 h-6 md:w-8 md:h-8 rounded-full inline-block align-middle mx-auto"
                                                style={{ backgroundColor: registration.vehicleColor || 'transparent', border: '1px solid #ccc' }}
                                                title={registration.vehicleColor}
                                            ></div>
                                        </td>
                                        <td className="py-2 px-4 md:py-4 md:px-6 border-b">
                                            <div className="flex flex-col md:flex-row gap-1 md:space-x-2">
                                                <button onClick={() => handleUpdate(registration._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 md:py-4 md:px-4 rounded text-xs md:text-sm flex items-center justify-center" title="Update"><FaEdit /></button>
                                                <button onClick={() => handleDelete(registration._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 md:py-4 md:px-4 rounded text-xs md:text-sm flex items-center justify-center" title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        No matching registrations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                    <button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center"><FaArrowLeft /></button>
                    <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg flex items-center justify-center"><FaDownload /></button>
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistrationList;