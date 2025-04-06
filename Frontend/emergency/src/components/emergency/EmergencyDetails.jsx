import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { FaArrowLeft, FaSave, FaDownload } from 'react-icons/fa';
import backgroundImage from '../../assets/background.png';
import logoImage from '/logo.png';

const EmergencyDetails = () => {
    const { id } = useParams();
    const [emergency, setEmergency] = useState(null);
    const [status, setStatus] = useState('Pending');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmergency = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/emergency/${id}`);
                setEmergency(response.data);
                if (response.data.status) {
                    setStatus(response.data.status);
                }
            } catch (error) {
                console.error("Error fetching emergency details:", error);
            }
        };
        fetchEmergency();
    }, [id]);

    const handleBack = () => {
        navigate('/list');
    };

    const handleOk = async () => {
        try {
            await axios.put(`http://localhost:5000/api/emergency/${id}`, { status: status });
            navigate('/list');
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        const logo = new Image();
        logo.src = logoImage;

        logo.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const now = new Date();
            const dateStr = now.toLocaleString();

            // Header
            doc.addImage(logo, 'PNG', 10, 10, 20, 20);
            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.text('Emergency Details Report', pageWidth / 2, 20, { align: 'center' });

            // Sub header
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${dateStr}`, 10, 35);

            // Table
            autoTable(doc, {
                startY: 45,
                head: [['Field', 'Value']],
                body: [
                    ['Name', emergency.name],
                    ['Contact Number', emergency.contactNumber],
                    ['Address', emergency.location.address],
                    ['Vehicle Type', emergency.vehicleType],
                    ['Vehicle Color', emergency.vehicleColor],
                    ['Emergency Type', emergency.emergencyType],
                    ['Description', emergency.description],
                    ['Status', status],
                ],
                theme: 'striped',
                styles: { fontSize: 10 },
                didDrawPage: (data) => {
                    // Footer
                    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text(pageStr, pageWidth - 20, pageHeight - 10);
                    doc.text("© 2025 Emergency Services", 10, pageHeight - 10);
                }
            });

            const fileName = `${emergency.name.replace(/\s+/g, '_')}_Emergency_Details.pdf`;
            doc.save(fileName);
        };
    };

    if (!emergency) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex justify-center items-center"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
            >
                <motion.div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto">
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
        >
            <motion.div
                className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                    Emergency Request Details
                </h2>
                <div className="space-y-4">
                    <p><strong>Name:</strong> {emergency.name}</p>
                    <p><strong>Tel:</strong> {emergency.contactNumber}</p>
                    <p><strong>Address:</strong> {emergency.location.address}</p>
                    <p><strong>Vehicle Type:</strong> {emergency.vehicleType}</p>
                    <p><strong>Vehicle Color:</strong> {emergency.vehicleColor}</p>
                    <p><strong>Emergency Type:</strong> {emergency.emergencyType}</p>
                    <p><strong>Description:</strong> {emergency.description}</p>
                    <div className="flex items-center">
                        <strong>Status:</strong>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border p-2 rounded ml-2"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={handleBack}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={handleOk}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                        >
                            <FaSave className="mr-2" /> Save
                        </button>
                        <button
                            onClick={handleDownload}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                        >
                            <FaDownload className="mr-2" /> Download Report
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmergencyDetails;
