import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../../assets/background.png';
import { motion } from 'framer-motion';

const UpdateVehicleForm = () => {
    // Get the vehicle ID from the URL parameter
    const { id } = useParams();
    // Use useNavigate for navigation
    const navigate = useNavigate();
    // Initialize form data state
    const [formData, setFormData] = useState({
        _id: id,
        vehicleNumber: '',
        vehicleType: '',
        vehicleColor: '',
        ownerName: '',
        ownerContact: '',
    });
    // Initializing error state
    const [errors, setErrors] = useState({});

    // Fetching vehicle data on component mount
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                // Making a GET request to fetch vehicle data
                const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
                // Update form data state with fetched data
                setFormData(response.data);
            } catch (error) {
                // Log error and display toast message
                console.error('Error fetching vehicle data:', error);
                toast.error('Failed to load vehicle data.');
            }
        };
        // Calling fetchVehicle function
        fetchVehicle();
    }, [id]);

    // Handling form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle contact number input, allowing only numeric value
        if (name === 'ownerContact') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: numericValue.slice(0, 10) });
        }
        // Handle vehicle number input, limiting to 6 characters
        else if (name === 'vehicleNumber') {
            setFormData({ ...formData, [name]: value.slice(0, 6) });
        }
        // Handling the other form input fields
        else {

            setFormData({ ...formData, [name]: value });
        }
        // Clears the corresponding error message
        setErrors({ ...errors, [name]: '' });
    };

    // Handling form submissions
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Initialize error object and validation flag
        let formErrors = {};
        let isValid = true;

        // Validate vehicle number
        if (!formData.vehicleNumber.trim()) {
            formErrors.vehicleNumber = 'Vehicle number is required.';
            isValid = false;
        }

        // Validate vehicle color
        if (!formData.vehicleColor.trim()) {
            formErrors.vehicleColor = 'Vehicle color is required.';
            isValid = false;
        }

        // Validate owner's name
        if (!formData.ownerName.trim()) {
            formErrors.ownerName = 'Owner name is required.';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(formData.ownerName)) {
            formErrors.ownerName = 'Owner name should contain only English letters.';
            isValid = false;
        }

        // Validate owner's contact number
        if (!formData.ownerContact.trim()) {
            formErrors.ownerContact = 'Owner contact number is required.';
            isValid = false;
        } else if (formData.ownerContact.length !== 10) {
            formErrors.ownerContact = 'Owner contact number should be 10 digits.';
            isValid = false;
        }

        // Validate vehicle type 
        if (!formData.vehicleType) {
            formErrors.vehicleType = 'Vehicle type is required.';
            isValid = false;
        }

        // Update error state
        setErrors(formErrors);

        // If form is invalid, return
        if (!isValid) {
            return;
        }

        try {
            // Making a PUT request to update vehicle data
            await axios.put(`http://localhost:5000/api/vehicles/${id}`, formData);
            // Display success toast message and navigate to vehicle list
            toast.success('Vehicle information updated successfully!');
            navigate('/vehicle-list');
        } catch (error) {
            // Handle API errors
            if (error.response && error.response.data && error.response.data.errors) {
                const errorData = error.response.data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {});
                setErrors(errorData);
            } else {
                // Display generic error toast message
                toast.error('Failed to update vehicle information.');
            }
        }
    };
    // Handle back button click
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
                    Update Vehicle Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="_id" className="block font-medium mb-1">ID</label>
                        <input
                            type="text"
                            id="_id"
                            name="_id"
                            value={formData._id}
                            disabled
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        />
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
                            placeholder="Enter vehicle number (max 6 characters)"
                        />
                        {errors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>}
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
                        <label htmlFor="ownerName" className="block font-medium mb-1">Owner Name</label>
                        <input
                            type="text"
                            id="ownerName"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter owner name"
                        />
                        {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                    </div>
                    <div>
                        <label htmlFor="ownerContact" className="block font-medium mb-1">Owner Contact Number</label>
                        <input
                            type="text"
                            id="ownerContact"
                            name="ownerContact"
                            value={formData.ownerContact}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter owner contact number"
                        />
                        {errors.ownerContact && <p className="text-red-500 text-sm mt-1">{errors.ownerContact}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition-colors duration-300"
                    >
                        Update
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

export default UpdateVehicleForm;