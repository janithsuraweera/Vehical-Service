import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const VehicleErrorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    errorType: '',
    errorDescription: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    mileage: '',
    lastServiceDate: '',
    symptoms: '',
    errorCode: '',
    errorLocation: '',
    errorSeverity: 'low',
    isRecurring: false,
    previousFixAttempts: '',
    currentStatus: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solution, setSolution] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.vehicleNumber.trim()) {
      formErrors.vehicleNumber = 'Vehicle number is required.';
      isValid = false;
    }

    if (!formData.errorType) {
      formErrors.errorType = 'Error type is required.';
      isValid = false;
    }

    if (!formData.errorDescription.trim()) {
      formErrors.errorDescription = 'Error description is required.';
      isValid = false;
    }

    if (!formData.vehicleMake.trim()) {
      formErrors.vehicleMake = 'Vehicle make is required.';
      isValid = false;
    }

    if (!formData.vehicleModel.trim()) {
      formErrors.vehicleModel = 'Vehicle model is required.';
      isValid = false;
    }

    if (!formData.vehicleYear) {
      formErrors.vehicleYear = 'Vehicle year is required.';
      isValid = false;
    }

    if (!formData.mileage) {
      formErrors.mileage = 'Mileage is required.';
      isValid = false;
    }

    if (!formData.symptoms.trim()) {
      formErrors.symptoms = 'Symptoms are required.';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const getErrorSolution = async () => {
    try {
      // Using a free API for car diagnostics
      const response = await axios.get(`https://api.api-ninjas.com/v1/cars?make=${formData.vehicleMake}&model=${formData.vehicleModel}&year=${formData.vehicleYear}`, {
        headers: {
          'X-Api-Key': 'YOUR_API_NINJAS_KEY' // Replace with your API key
        }
      });
      
      // This is a simplified example - in a real app, you would have a more sophisticated
      // error diagnosis system based on the API response
      const carData = response.data[0];
      
      let solutionText = `Based on the ${carData.make} ${carData.model} ${carData.year} information:\n\n`;
      
      if (formData.errorType === 'engine') {
        solutionText += "For engine issues, check the following:\n";
        solutionText += "1. Check engine oil level and condition\n";
        solutionText += "2. Inspect spark plugs and ignition system\n";
        solutionText += "3. Check for any error codes using an OBD scanner\n";
      } else if (formData.errorType === 'brake') {
        solutionText += "For brake issues, check the following:\n";
        solutionText += "1. Check brake pad thickness\n";
        solutionText += "2. Inspect brake fluid level\n";
        solutionText += "3. Check for any leaks in the brake system\n";
      } else if (formData.errorType === 'transmission') {
        solutionText += "For transmission issues, check the following:\n";
        solutionText += "1. Check transmission fluid level and condition\n";
        solutionText += "2. Inspect for any leaks\n";
        solutionText += "3. Check for any unusual noises during gear changes\n";
      } else {
        solutionText += "For general issues, we recommend:\n";
        solutionText += "1. Check all fluid levels\n";
        solutionText += "2. Inspect for any visible damage or leaks\n";
        solutionText += "3. Schedule a diagnostic appointment with a qualified mechanic\n";
      }
      
      return solutionText;
    } catch (error) {
      console.error('Error fetching car data:', error);
      return "Unable to provide specific solution. Please consult a qualified mechanic.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get solution from API
      const solutionText = await getErrorSolution();
      setSolution(solutionText);
      
      // Save error report to database
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      await axios.post('http://localhost:5000/api/vehicle-errors', formData, { headers });
      
      toast.success('Vehicle error reported successfully!');
      
      // Reset form after successful submission
      setFormData({
        vehicleNumber: '',
        errorType: '',
        errorDescription: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        mileage: '',
        lastServiceDate: '',
        symptoms: '',
        errorCode: '',
        errorLocation: '',
        errorSeverity: 'low',
        isRecurring: false,
        previousFixAttempts: '',
        currentStatus: 'active'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit vehicle error report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/vehicle-errors');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Report Vehicle Error</h1>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vehicle number"
                />
                {errors.vehicleNumber && <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>}
              </div>

              <div>
                <label htmlFor="errorType" className="block text-sm font-medium text-gray-700 mb-1">
                  Error Type *
                </label>
                <select
                  id="errorType"
                  name="errorType"
                  value={formData.errorType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select error type</option>
                  <option value="engine">Engine</option>
                  <option value="brake">Brake</option>
                  <option value="transmission">Transmission</option>
                  <option value="electrical">Electrical</option>
                  <option value="suspension">Suspension</option>
                  <option value="other">Other</option>
                </select>
                {errors.errorType && <p className="mt-1 text-sm text-red-600">{errors.errorType}</p>}
              </div>

              <div>
                <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Make *
                </label>
                <input
                  type="text"
                  id="vehicleMake"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Toyota, Honda"
                />
                {errors.vehicleMake && <p className="mt-1 text-sm text-red-600">{errors.vehicleMake}</p>}
              </div>

              <div>
                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Camry, Civic"
                />
                {errors.vehicleModel && <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>}
              </div>

              <div>
                <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Year *
                </label>
                <input
                  type="number"
                  id="vehicleYear"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020"
                />
                {errors.vehicleYear && <p className="mt-1 text-sm text-red-600">{errors.vehicleYear}</p>}
              </div>

              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage (km) *
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                />
                {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
              </div>

              <div>
                <label htmlFor="lastServiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Service Date
                </label>
                <input
                  type="date"
                  id="lastServiceDate"
                  name="lastServiceDate"
                  value={formData.lastServiceDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="errorSeverity" className="block text-sm font-medium text-gray-700 mb-1">
                  Error Severity
                </label>
                <select
                  id="errorSeverity"
                  name="errorSeverity"
                  value={formData.errorSeverity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="errorDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Error Description *
              </label>
              <textarea
                id="errorDescription"
                name="errorDescription"
                value={formData.errorDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the error in detail"
              ></textarea>
              {errors.errorDescription && <p className="mt-1 text-sm text-red-600">{errors.errorDescription}</p>}
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms *
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the symptoms you're experiencing"
              ></textarea>
              {errors.symptoms && <p className="mt-1 text-sm text-red-600">{errors.symptoms}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="errorCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Error Code (if any)
                </label>
                <input
                  type="text"
                  id="errorCode"
                  name="errorCode"
                  value={formData.errorCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., P0300"
                />
              </div>

              <div>
                <label htmlFor="errorLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Error Location
                </label>
                <input
                  type="text"
                  id="errorLocation"
                  name="errorLocation"
                  value={formData.errorLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Front left wheel, Engine compartment"
                />
              </div>
            </div>

            <div>
              <label htmlFor="previousFixAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                Previous Fix Attempts
              </label>
              <textarea
                id="previousFixAttempts"
                name="previousFixAttempts"
                value={formData.previousFixAttempts}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe any previous attempts to fix this issue"
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                This is a recurring issue
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Error Report'}
              </button>
            </div>
          </form>

          {solution && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Recommended Solution</h3>
              <div className="whitespace-pre-line text-blue-700">{solution}</div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleErrorForm; 