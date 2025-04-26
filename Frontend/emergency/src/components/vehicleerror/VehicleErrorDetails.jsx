import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const VehicleErrorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedError, setEditedError] = useState(null);

  useEffect(() => {
    fetchErrorDetails();
  }, [id]);

  const fetchErrorDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.get(`http://localhost:5000/api/vehicle-errors/${id}`, { headers });
      setError(response.data);
      setEditedError(response.data);
    } catch (error) {
      console.error('Error fetching error details:', error);
      toast.error('Failed to load error details');
      navigate('/vehicle-errors');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedError(error);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      await axios.put(`http://localhost:5000/api/vehicle-errors/${id}`, editedError, { headers });
      setError(editedError);
      setIsEditing(false);
      toast.success('Error report updated successfully');
    } catch (error) {
      console.error('Error updating error report:', error);
      toast.error('Failed to update error report');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this error report?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        await axios.delete(`http://localhost:5000/api/vehicle-errors/${id}`, { headers });
        toast.success('Error report deleted successfully');
        navigate('/vehicle-errors');
      } catch (error) {
        console.error('Error deleting error report:', error);
        toast.error('Failed to delete error report');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedError(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Error report not found</div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/vehicle-errors')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Back to Error Reports
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Vehicle Error Details</h1>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                    >
                      <FaCheck className="mr-2" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={editedError.vehicleNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{error.vehicleNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="vehicleMake"
                        value={editedError.vehicleMake}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{error.vehicleMake}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="vehicleModel"
                        value={editedError.vehicleModel}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{error.vehicleModel}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="vehicleYear"
                        value={editedError.vehicleYear}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{error.vehicleYear}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Error Type</label>
                    {isEditing ? (
                      <select
                        name="errorType"
                        value={editedError.errorType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="engine">Engine</option>
                        <option value="brake">Brake</option>
                        <option value="transmission">Transmission</option>
                        <option value="electrical">Electrical</option>
                        <option value="suspension">Suspension</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900 capitalize">{error.errorType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    {isEditing ? (
                      <select
                        name="errorSeverity"
                        value={editedError.errorSeverity}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    ) : (
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(error.errorSeverity)}`}>
                        {error.errorSeverity}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {isEditing ? (
                      <select
                        name="currentStatus"
                        value={editedError.currentStatus}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    ) : (
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(error.currentStatus)}`}>
                        {error.currentStatus}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Error Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="errorCode"
                        value={editedError.errorCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{error.errorCode || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Description</h2>
              {isEditing ? (
                <textarea
                  name="errorDescription"
                  value={editedError.errorDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{error.errorDescription}</p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mileage</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="mileage"
                      value={editedError.mileage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{error.mileage || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Service Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="lastServiceDate"
                      value={editedError.lastServiceDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{error.lastServiceDate ? new Date(error.lastServiceDate).toLocaleDateString() : 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Error Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="errorLocation"
                      value={editedError.errorLocation}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{error.errorLocation || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Is Recurring</label>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={editedError.isRecurring}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{error.isRecurring ? 'Yes' : 'No'}</p>
                  )}
                </div>
              </div>
            </div>

            {error.previousFixAttempts && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Previous Fix Attempts</h2>
                {isEditing ? (
                  <textarea
                    name="previousFixAttempts"
                    value={editedError.previousFixAttempts}
                    onChange={handleInputChange}
                    rows="4"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">{error.previousFixAttempts}</p>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <div>
                  <p>Created: {new Date(error.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p>Last Updated: {new Date(error.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleErrorDetails; 