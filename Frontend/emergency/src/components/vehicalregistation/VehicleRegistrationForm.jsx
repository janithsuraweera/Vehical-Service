import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../../assets/background.png';
import { FaArrowLeft } from 'react-icons/fa';

const VehicleRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    customerNIC: '',
    vehicleNumber: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleColor: '',
  });
  const [errors, setErrors] = useState({});

  const handleNICChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    
    // Limit to 12 digits
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    
    // Add 'V' if 9 or 12 digits are entered
    if (value.length === 9 || value.length === 12) {
      value = value + 'V';
    }
    
    setFormData({ ...formData, customerNIC: value });
    setErrors({ ...errors, customerNIC: '' });
  };

  const validateNIC = (nic) => {
    // Validate old NIC format (9 digits + V) or new NIC format (12 digits + V)
    const oldNicPattern = /^[0-9]{9}[Vv]$/;
    const newNicPattern = /^[0-9]{12}[Vv]$/;
    return oldNicPattern.test(nic) || newNicPattern.test(nic);
  };

  const validateVehicleNumber = (number) => {
    // Sri Lankan vehicle number format validation
    const pattern = /^[A-Z]{2,3}-[0-9]{4}$/;
    return pattern.test(number);
  };

  const validateName = (name) => {
    // Name should contain only letters and spaces, at least 2 characters
    const pattern = /^[A-Za-z\s]{2,}$/;
    return pattern.test(name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required.';
      isValid = false;
    } else if (!validateName(formData.name)) {
      formErrors.name = 'Name should contain only letters and spaces.';
      isValid = false;
    }

    // NIC validation
    if (!formData.customerNIC.trim()) {
      formErrors.customerNIC = 'Customer NIC is required.';
      isValid = false;
    } else if (!validateNIC(formData.customerNIC)) {
      formErrors.customerNIC = 'Please enter a valid NIC number (e.g., 123456789V or 123456789012V).';
      isValid = false;
    }

    // Vehicle number validation
    if (!formData.vehicleNumber.trim()) {
      formErrors.vehicleNumber = 'Vehicle number is required.';
      isValid = false;
    } else if (!validateVehicleNumber(formData.vehicleNumber)) {
      formErrors.vehicleNumber = 'Please enter a valid vehicle number (e.g., AB-1234 or ABC-1234).';
      isValid = false;
    }

    // Vehicle type validation
    if (!formData.vehicleType) {
      formErrors.vehicleType = 'Vehicle type is required.';
      isValid = false;
    }

    // Vehicle model validation
    if (!formData.vehicleModel) {
      formErrors.vehicleModel = 'Vehicle model is required.';
      isValid = false;
    }

    // Vehicle color validation
    if (!formData.vehicleColor.trim()) {
      formErrors.vehicleColor = 'Vehicle color is required.';
      isValid = false;
    } else if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.vehicleColor)) {
      formErrors.vehicleColor = 'Invalid color format (e.g., #FFFFFF).';
      isValid = false;
    }

    setErrors(formErrors);

    if (!isValid) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/vehicle-registration', formData);
      toast.success('Vehicle registration request submitted successfully!');
      navigate('/dashboard'); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorData = error.response.data.errors.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.msg }),
          {}
        );
        setErrors(errorData);
      } else {
        toast.error('Failed to submit vehicle registration request.');
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard'); 
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
          Vehicle Registration Request
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
              className={`border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
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
              onChange={handleNICChange}
              maxLength={13}
              className={`border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.customerNIC ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter 9 or 12 digit NIC number"
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
              className={`border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter vehicle number (e.g., AB-1234 or ABC-1234)"
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
              className={`border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.vehicleType ? 'border-red-500' : 'border-gray-300'
              }`}
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
              className={`border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
              }`}
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
                className={`border w-16 h-12 rounded-lg shadow-sm cursor-pointer ${
                  errors.vehicleColor ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="text-gray-700">{formData.vehicleColor || '#000000'}</span>
            </div>
            {errors.vehicleColor && <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VehicleRegistrationForm;