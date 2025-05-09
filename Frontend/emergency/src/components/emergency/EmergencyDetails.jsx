import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { FaArrowLeft, FaSave, FaDownload, FaBell, FaTimes } from 'react-icons/fa';
import backgroundImage from '../../assets/background.png';
import logoImage from '/logo.png';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const EmergencyDetails = () => {
    const { id } = useParams();
    const [emergency, setEmergency] = useState(null);
    const [status, setStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchEmergency = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Please log in to view emergency details');
                }
                const response = await axios.get(
                    `http://localhost:5000/api/emergency/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setEmergency(response.data);
                if (response.data.status) {
                    setStatus(response.data.status);
                }
            } catch (error) {
                console.error("Error fetching emergency details:", error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to load emergency details';
                setError(errorMessage);
                toast.error(errorMessage);
                if (error.response?.status === 404 || error.response?.status === 401) {
                    setTimeout(() => navigate('/emergencylist'), 2000);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEmergency();
        fetchNotifications();
    }, [id, navigate]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleBack = () => {
        navigate('/emergencylist');
    };

    const handleOk = async () => {
        try {
            if (!user || user.role !== 'admin') {
                toast.error('Only administrators can update emergency status');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please log in to update emergency status');
            }

            const response = await axios.put(
                `http://localhost:5000/api/emergency/${id}`, 
                { status: status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            addNotification({
                id: Date.now(),
                title: 'Emergency Status Updated',
                message: `Emergency request for ${emergency.vehicleNumber} has been updated to ${status}`,
                timestamp: new Date(),
                read: false
            });

            toast.success('Status updated successfully');
            navigate('/emergencylist');
        } catch (error) {
            console.error("Error updating status:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
            toast.error(errorMessage);
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
            doc.addImage(logo, 'PNG', 10, 10, 30, 30);
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Emergency Detail Report', pageWidth / 2, 20, { align: 'center' });

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
                columnStyles: {
                    1: { cellWidth: 40 },
                },
                didCell: (data) => {
                    if (data.column.index === 1 && data.row.index === 5) {
                        doc.setFillColor(emergency.vehicleColor);
                        doc.rect(data.cell.x + 2, data.cell.y + 2, 16, 16, 'F');
                    }
                },
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

    if (loading) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex justify-center items-center"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
            >
                <motion.div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto">
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading emergency details...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex justify-center items-center"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
            >
                <motion.div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <button
                            onClick={handleBack}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center mx-auto"
                        >
                            <FaArrowLeft className="mr-2" /> Back to List
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!emergency) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Emergency Details</h1>
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-600 hover:text-gray-800 relative"
                        >
                            <FaBell size={24} />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b hover:bg-gray-50 ${
                                                    !notification.read ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{notification.title}</h4>
                                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(notification.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTimes size={14} />
                                                    </button>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
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
                        <p><strong>Contact Number:</strong> {emergency.contactNumber}</p>
                        <p><strong>Address:</strong> {emergency.location.address}</p>
                        <p><strong>Vehicle Type:</strong> {emergency.vehicleType}</p>
                        <p>
                            <strong>Vehicle Color:</strong>
                            <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: emergency.vehicleColor, marginLeft: '7px' }}></div>
                        </p>
                        <p><strong>Vehicle Number:</strong> {emergency.vehicleNumber}</p>
                        <p><strong>Emergency Type:</strong> {emergency.emergencyType}</p>
                        <p><strong>Description:</strong> {emergency.description}</p>
                        {user && user.role === 'admin' ? (
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
                        ) : (
                            <p><strong>Status:</strong> {status}</p>
                        )}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={handleBack}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
                            >
                                <FaArrowLeft className="mr-2" /> Back
                            </button>
                            {user && user.role === 'admin' && (
                                <button
                                    onClick={handleOk}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                                >
                                    <FaSave className="mr-2" /> Save
                                </button>
                            )}
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
        </div>
    );
};

export default EmergencyDetails;