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
        name: '',
        customerNIC: '',
        vehicleNumber: '',
        vehicleType: '',
        vehicleModel: '',
        vehicleColor: '',
    });
    // Initializing error state
    const [errors, setErrors] = useState({});

    // Fetching vehicle data on component mount
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vehicle-registration/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
                toast.error('Failed to load vehicle data.');
            }
        };
        fetchVehicle();
    }, [id]);

    // Handling form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    // Handling form submissions
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            formErrors.name = 'Name is required.';
            isValid = false;
        }

        if (!formData.customerNIC.trim()) {
            formErrors.customerNIC = 'Customer NIC is required.';
            isValid = false;
        }

        if (!formData.vehicleNumber.trim()) {
            formErrors.vehicleNumber = 'Vehicle number is required.';
            isValid = false;
        }

        if (!formData.vehicleType) {
            formErrors.vehicleType = 'Vehicle type is required.';
            isValid = false;
        }

        if (!formData.vehicleModel) {
            formErrors.vehicleModel = 'Vehicle model is required.';
            isValid = false;
        }

        if (!formData.vehicleColor.trim()) {
            formErrors.vehicleColor = 'Vehicle color is required.';
            isValid = false;
        }

        setErrors(formErrors);

        if (!isValid) {
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/vehicle-registration/${id}`, formData);
            toast.success('Vehicle information updated successfully!');
            navigate('/view-registrations');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorData = error.response.data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {});
                setErrors(errorData);
            } else {
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
                        <label htmlFor="customerNIC" className="block font-medium mb-1">Customer NIC</label>
                        <input
                            type="text"
                            id="customerNIC"
                            name="customerNIC"
                            value={formData.customerNIC}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter customer NIC"
                        />
                        {errors.customerNIC && <p className="text-red-500 text-sm mt-1">{errors.customerNIC}</p>}
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
                            placeholder="Enter vehicle number"
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
                        <label htmlFor="vehicleModel" className="block font-medium mb-1">Vehicle Model</label>
                        <select
                            id="vehicleModel"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Vehicle Model</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Suzuki">Suzuki</option>
                            <option value="BMW">BMW</option>
                            <option value="Benz">Benz</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>}
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