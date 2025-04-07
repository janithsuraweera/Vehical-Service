import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../../assets/background.png';
import { FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const EmergencyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        vehicleNumber: '',
        location: {
            type: 'Point',
            coordinates: [0, 0],
            address: '',
        },
        vehicleType: '',
        vehicleColor: '',
        emergencyType: '', // Initial value changed to empty string
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contactNumber') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: numericValue.slice(0, 10) });
        } else if (name === 'location.address') {
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    address: value,
                },
            });
        } else if (name === 'vehicleNumber') {
            setFormData({ ...formData, [name]: value.slice(0, 7) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const getCurrentLocation = () => {
        setIsFetchingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData({
                        ...formData,
                        location: {
                            ...formData.location,
                            coordinates: [longitude, latitude],
                            address: `Lat: ${latitude}, Lng: ${longitude}`,
                        },
                    });
                    toast.success('Location fetched successfully!');
                    setIsFetchingLocation(false);
                },
                (error) => {
                    toast.error('Failed to fetch location.');
                    setIsFetchingLocation(false);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
            setIsFetchingLocation(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            contactNumber: '',
            vehicleNumber: '',
            location: {
                type: 'Point',
                coordinates: [0, 0],
                address: '',
            },
            vehicleType: '',
            vehicleColor: '',
            emergencyType: '',
            description: '',
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            formErrors.name = 'Name is required.';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            formErrors.name = 'Name should contain only English letters.';
            isValid = false;
        }

        if (!formData.contactNumber.trim()) {
            formErrors.contactNumber = 'Contact number is required.';
            isValid = false;
        } else if (formData.contactNumber.length !== 10) {
            formErrors.contactNumber = 'Contact number should be 10 digits.';
            isValid = false;
        }

        if (!formData.vehicleNumber.trim()) {
            formErrors.vehicleNumber = 'Vehicle number is required.';
            isValid = false;
        }

        if (!formData.location.address.trim()) {
            formErrors.location = 'Address is required.';
            isValid = false;
        }

        if (!formData.vehicleColor.trim()) {
            formErrors.vehicleColor = 'Vehicle color is required.';
            isValid = false;
        }

        if (!formData.description.trim()) {
            formErrors.description = 'Description is required.';
            isValid = false;
        }

        if (!formData.vehicleType) {
            formErrors.vehicleType = 'Vehicle type is required.';
            isValid = false;
        }

        if (!formData.emergencyType) {
            formErrors.emergencyType = 'Emergency type is required.';
            isValid = false;
        }

        setErrors(formErrors);

        if (!isValid) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/emergency', formData);
            toast.success(`Emergency request submitted successfully! Emergency Request No: ${response.data.emergencyRequestNo}`);
            resetForm();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorData = error.response.data.errors.reduce(
                    (acc, err) => ({ ...acc, [err.path]: err.msg }),
                    {}
                );
                setErrors(errorData);
            } else {
                toast.error('Failed to submit emergency request.');
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
        >
            <motion.div
                className="w-full max-w-4xl p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
                    Vehicle Emergency Request
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block font-medium mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="contactNumber" className="block font-medium mb-1">Contact Number</label>
                        <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your contact number"
                        />
                        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="vehicleNumber" className="block font-medium mb-1">Vehicle Number</label>
                        <input
                            type="text"
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter vehicle number (max 7 characters)"
                        />
                        {errors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>}
                    </div>
                    <div className="relative">
                        <label htmlFor="address" className="block font-medium mb-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your address"
                        />
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isFetchingLocation}
                            className="absolute right-2 top-9 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors duration-300"
                        >
                            {isFetchingLocation ? 'Fetching...' : <FaMapMarkerAlt />}
                        </button>
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                    <div>
                        <label htmlFor="vehicleType" className="block font-medium mb-1">Vehicle Type</label>
                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="car">Car</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bus">Bus</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                    </div>
                    <div>
                        <label htmlFor="vehicleColor" className="block font-medium mb-1">Vehicle Color</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="color"
                                id="vehicleColor"
                                name="vehicleColor"
                                value={formData.vehicleColor}
                                onChange={handleChange}
                                className="border w-16 h-12 rounded-lg shadow-sm cursor-pointer"
                            />
                            <span className="text-gray-700">{formData.vehicleColor || '#000000'}</span>
                        </div>
                        {errors.vehicleColor && <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>}
                    </div>
                    <div>
                        <label htmlFor="emergencyType" className="block font-medium mb-1">Emergency Type</label>
                        <select
                            id="emergencyType"
                            name="emergencyType"
                            value={formData.emergencyType}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Emergency Type</option>
                            <option value="breakdown">Breakdown</option>
                            <option value="accident">Accident</option>
                            <option value="flat_tire">Flat Tire</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.emergencyType && <p className="text-red-500 text-sm mt-1">{errors.emergencyType}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block font-medium mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter a description"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition-colors duration-300"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg w-full mt-4 transition-colors duration-300 flex items-center justify-center"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmergencyForm;