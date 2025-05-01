import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTheme } from '../../context/ThemeContext';

const VehicleRegistrationList = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
    const [vehicleModelFilter, setVehicleModelFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/vehicle-registration');
                setRegistrations(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching vehicle registrations:", error);
                setError("Failed to load vehicle registration list.");
                toast.error("Failed to load vehicle registration list.");
            } finally {
                setLoading(false);
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
            const body = filteredRegistrations.map(registration => [
                registration.name,
                registration.customerNIC,
                registration.vehicleNumber,
                registration.vehicleType,
                registration.vehicleModel,
                registration.vehicleColor
            ]);

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
                                doc.setDrawColor(0);
                                doc.setLineWidth(0.1);
                                doc.rect(rectX, rectY, squareSize, squareSize, 'S');
                            } catch (e) {
                                console.warn(`PDF Draw Error: Invalid color '${color}'?`, e);
                                doc.setTextColor(150);
                                doc.setFontSize(6);
                                doc.text('?', cell.x + cell.width / 2, cell.y + cell.height / 2, { align: 'center', baseline: 'middle' });
                                doc.setTextColor(0);
                            }
                            doc.setDrawColor(0);
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

    const resetFilters = () => {
        setSearchTerm('');
        setVehicleTypeFilter('');
        setVehicleModelFilter('');
    };

    const filteredRegistrations = registrations.filter(registration => {
        const searchMatch = registration.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = vehicleTypeFilter ? registration.vehicleType === vehicleTypeFilter : true;
        const modelMatch = vehicleModelFilter ? registration.vehicleModel === vehicleModelFilter : true;
        return searchMatch && typeMatch && modelMatch;
    });

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} p-4`}>
            <div className="w-full h-full">
                <div className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${darkMode ? 'bg-gray-800' : 'bg-white bg-opacity-90'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text'}`}>
                            Vehicle Registration Management
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
                                    ref={searchInputRef}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by vehicle no. or name..."
                                    className={`w-full pl-12 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 ${
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
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle Type</label>
                                <select 
                                    value={vehicleTypeFilter} 
                                    onChange={(e) => setVehicleTypeFilter(e.target.value)} 
                                    className={`w-48 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">All Types</option>
                                    <option value="car">Car</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="bus">Bus</option>
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle Model</label>
                                <select 
                                    value={vehicleModelFilter} 
                                    onChange={(e) => setVehicleModelFilter(e.target.value)} 
                                    className={`w-48 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">All Models</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Honda">Honda</option>
                                    <option value="Nissan">Nissan</option>
                                    <option value="Suzuki">Suzuki</option>
                                    <option value="BMW">BMW</option>
                                    <option value="Benz">Benz</option>
                                    <option value="other">Other</option>
                                </select>
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
                                onClick={() => window.location.reload()}
                                className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg`}
                            >
                                Retry
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="text-center py-8">
                            <div className={`animate-spin rounded-full h-12 w-12 border-4 ${darkMode ? 'border-blue-400' : 'border-blue-500'} border-t-transparent mx-auto`}></div>
                            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>Loading vehicle registrations...</p>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div className={`text-center py-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>No vehicle registrations found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-lg">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer NIC</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Vehicle Number</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Vehicle Type</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Vehicle Model</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Color</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                                    {filteredRegistrations.map((registration) => (
                                        <tr key={registration._id} className={`transition-colors duration-200 group ${
                                            darkMode 
                                            ? 'hover:bg-gray-700/70 text-gray-300' 
                                            : 'hover:bg-gray-50 text-gray-900'
                                        }`}>
                                            <td className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                <Link to={`/vehicle-registration/${registration._id}`} className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline group-hover:text-blue-700 transition-colors duration-200`}>
                                                    {registration.name}
                                                </Link>
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                {registration.customerNIC}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                {registration.vehicleNumber}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                {registration.vehicleType}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                {registration.vehicleModel}
                                            </td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                                                darkMode 
                                                ? 'text-gray-300 group-hover:text-gray-100' 
                                                : 'text-gray-900 group-hover:text-gray-900'
                                            }`}>
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border ${darkMode ? 'border-gray-500 group-hover:border-gray-400' : 'border-gray-200 group-hover:border-gray-300'} transition-colors duration-200`}
                                                        style={{ backgroundColor: registration.vehicleColor }}
                                                    ></div>
                                                    <span>{registration.vehicleColor}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => handleUpdate(registration._id)}
                                                        className={`${
                                                            darkMode 
                                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                                            : 'bg-blue-500 hover:bg-blue-600'
                                                        } text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm group/btn`}
                                                    >
                                                        <FaEdit className="mr-1 group-hover/btn:rotate-12 transition-transform duration-300" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(registration._id)}
                                                        className={`${
                                                            darkMode 
                                                            ? 'bg-red-600 hover:bg-red-700' 
                                                            : 'bg-red-500 hover:bg-red-600'
                                                        } text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm group/btn`}
                                                    >
                                                        <FaTrash className="mr-1 group-hover/btn:rotate-12 transition-transform duration-300" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleBack}
                            className={`${
                                darkMode 
                                ? 'bg-gray-600 hover:bg-gray-700' 
                                : 'bg-gray-500 hover:bg-gray-600'
                            } text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300`}
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistrationList;