import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowLeft, FaCamera, FaTrash, FaMap, FaUser, FaPhone, FaCar, FaInfoCircle } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import backgroundImage from '../../assets/background.png';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map Click Handler Component
const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e);
        },
    });
    return null;
};

// Map Component
const Map = ({ position, onLocationSelect }) => {
    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} />
            <MapClickHandler onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
};

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
        emergencyType: '',
        description: '',
        photos: [],
    });
    const [errors, setErrors] = useState({});
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [mapPosition, setMapPosition] = useState([6.9271, 79.8612]); // Default to Colombo

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

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setMapPosition([lat, lng]);
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                coordinates: [lng, lat],
                address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
            },
        }));
    };

    const getCurrentLocation = () => {
        setIsFetchingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapPosition([latitude, longitude]);
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

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        
        if (formData.photos.length + files.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }

        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            if (!isValidType) {
                toast.error(`${file.name} is not a valid image file`);
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large. Maximum size is 5MB`);
            }

            return isValidType && isValidSize;
        });

        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewPhotos([...previewPhotos, ...newPreviewUrls]);

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...validFiles]
        }));
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
        setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
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
            photos: [],
        });
        setPreviewPhotos([]);
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
            const formDataToSend = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key === 'location') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'photos') {
                    formData.photos.forEach((photo, index) => {
                        formDataToSend.append('photos', photo);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await axios.post('http://localhost:5000/api/emergency', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
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
            className="min-h-screen bg-cover bg-center flex justify-center items-center p-4"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
        >
            <motion.div
                className="w-full max-w-4xl bg-white bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header with gradient background */}
                <div className="relative h-40 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="relative h-full flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-white text-center mb-2">
                            Vehicle Emergency Request
                        </h2>
                        <p className="text-blue-100 text-center max-w-2xl">
                            Please fill out this form with accurate information about your emergency situation
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaUser className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="contactNumber" className="block font-medium text-gray-700 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                        placeholder="Enter your contact number"
                                    />
                                    {errors.contactNumber && <p className="text-red-500 text-sm mt-2">{errors.contactNumber}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaCar className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800">Vehicle Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="vehicleNumber" className="block font-medium text-gray-700 mb-2">
                                        Vehicle Number
                                    </label>
                                    <input
                                        type="text"
                                        id="vehicleNumber"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                        placeholder="Enter vehicle number"
                                    />
                                    {errors.vehicleNumber && <p className="text-red-500 text-sm mt-2">{errors.vehicleNumber}</p>}
                                </div>
                                <div>
                                    <label htmlFor="vehicleType" className="block font-medium text-gray-700 mb-2">
                                        Vehicle Type
                                    </label>
                                    <select
                                        id="vehicleType"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                    >
                                        <option value="">Select Vehicle Type</option>
                                        <option value="car">Car</option>
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="bus">Bus</option>
                                        <option value="truck">Truck</option>
                                        <option value="van">Van</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.vehicleType && <p className="text-red-500 text-sm mt-2">{errors.vehicleType}</p>}
                                </div>
                                <div>
                                    <label htmlFor="vehicleColor" className="block font-medium text-gray-700 mb-2">
                                        Vehicle Color
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="color"
                                            id="vehicleColor"
                                            name="vehicleColor"
                                            value={formData.vehicleColor}
                                            onChange={handleChange}
                                            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-blue-400 transition-all duration-200"
                                        />
                                        <span className="font-mono text-lg bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                            {formData.vehicleColor || '#000000'}
                                        </span>
                                    </div>
                                    {errors.vehicleColor && <p className="text-red-500 text-sm mt-2">{errors.vehicleColor}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800">Location Details</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex space-x-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            id="address"
                                            name="location.address"
                                            value={formData.location.address}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                            placeholder="Click on map or use current location"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            disabled={isFetchingLocation}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                            title="Get Current Location"
                                        >
                                            <FaMapMarkerAlt size={24} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowMap(!showMap)}
                                        className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg text-lg"
                                    >
                                        <FaMap />
                                        <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
                                    </button>
                                </div>
                                {showMap && (
                                    <div className="mt-4 h-[400px] rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
                                        <Map position={mapPosition} onLocationSelect={handleMapClick} />
                                    </div>
                                )}
                                {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                            </div>
                        </div>

                        {/* Emergency Details Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaInfoCircle className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800">Emergency Details</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="emergencyType" className="block font-medium text-gray-700 mb-2">
                                        Emergency Type
                                    </label>
                                    <select
                                        id="emergencyType"
                                        name="emergencyType"
                                        value={formData.emergencyType}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                                    >
                                        <option value="">Select Emergency Type</option>
                                        <option value="breakdown">Breakdown</option>
                                        <option value="accident">Accident</option>
                                        <option value="flat_tire">Flat Tire</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.emergencyType && <p className="text-red-500 text-sm mt-2">{errors.emergencyType}</p>}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg min-h-[150px]"
                                        placeholder="Describe the emergency situation in detail"
                                    ></textarea>
                                    {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Photos Section */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaCamera className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800">Photos</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-6">
                                    {previewPhotos.map((preview, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative group"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-40 h-40 object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-200 group">
                                        <div className="text-center">
                                            <FaCamera className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                            <span className="mt-3 block text-lg text-gray-600 group-hover:text-blue-500">Add Photo</span>
                                            <span className="mt-2 block text-sm text-gray-500">Max 5 photos</span>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                    <div className="text-gray-500">
                                        <p className="text-lg font-medium">{formData.photos.length}/5 photos</p>
                                        <p className="text-sm mt-1">Supported formats: JPG, JPEG, PNG</p>
                                        <p className="text-sm">Max size: 5MB per photo</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-lg"
                            >
                                <FaArrowLeft />
                                <span>Back</span>
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-lg font-medium"
                            >
                                Submit Emergency Request
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EmergencyForm;