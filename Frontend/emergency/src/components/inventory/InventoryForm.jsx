import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../../assets/background.png';
import { FaArrowLeft, FaImage } from 'react-icons/fa';

const InventoryForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        productPrice: '',
        productQuantity: '',
        productDescription: '',
        productImage: null,
        category: '',
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                // Validate file type and size immediately
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (!validTypes.includes(file.type)) {
                    toast.error('Please upload a valid image file (JPEG, PNG, GIF, or SVG)');
                    return;
                }

                if (file.size > maxSize) {
                    toast.error('Image size should be less than 5MB');
                    return;
                }

                setFormData({ ...formData, [name]: file });
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setPreviewImage(null);
            }
        } else {
            // Validate numeric fields immediately
            if (name === 'productPrice' || name === 'productQuantity') {
                if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                    setFormData({ ...formData, [name]: value });
                }
            } else {
                setFormData({ ...formData, [name]: value });
            }
        }

        // Clear error for the changed field
        setErrors({ ...errors, [name]: '' });
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            productName: '',
            productPrice: '',
            productQuantity: '',
            productDescription: '',
            productImage: null,
            category: '',
        });
        setPreviewImage(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Product ID validation
        if (!formData.productId || formData.productId.trim() === '') {
            newErrors.productId = 'Product ID is required';
        } else if (formData.productId.trim().length < 3) {
            newErrors.productId = 'Product ID must be at least 3 characters long';
        } else if (formData.productId.trim().length > 50) {
            newErrors.productId = 'Product ID cannot exceed 50 characters';
        }

        // Product Name validation
        if (!formData.productName || formData.productName.trim() === '') {
            newErrors.productName = 'Product name is required';
        } else if (formData.productName.trim().length < 3) {
            newErrors.productName = 'Product name must be at least 3 characters long';
        } else if (formData.productName.trim().length > 100) {
            newErrors.productName = 'Product name cannot exceed 100 characters';
        }

        // Category validation
        if (!formData.category || formData.category.trim() === '') {
            newErrors.category = 'Please select a category';
        }

        // Product Price validation
        if (!formData.productPrice) {
            newErrors.productPrice = 'Product price is required';
        } else if (isNaN(formData.productPrice)) {
            newErrors.productPrice = 'Product price must be a number';
        } else if (parseFloat(formData.productPrice) <= 0) {
            newErrors.productPrice = 'Product price must be greater than 0';
        } else if (parseFloat(formData.productPrice) > 1000000) {
            newErrors.productPrice = 'Product price cannot exceed Rs. 1,000,000';
        }

        // Product Quantity validation
        if (!formData.productQuantity) {
            newErrors.productQuantity = 'Product quantity is required';
        } else if (!Number.isInteger(Number(formData.productQuantity))) {
            newErrors.productQuantity = 'Product quantity must be a whole number';
        } else if (Number(formData.productQuantity) <= 0) {
            newErrors.productQuantity = 'Product quantity must be greater than 0';
        } else if (Number(formData.productQuantity) > 10000) {
            newErrors.productQuantity = 'Product quantity cannot exceed 10,000';
        }

        // Product Description validation
        if (!formData.productDescription || formData.productDescription.trim() === '') {
            newErrors.productDescription = 'Product description is required';
        } else if (formData.productDescription.trim().length < 10) {
            newErrors.productDescription = 'Product description must be at least 10 characters long';
        } else if (formData.productDescription.trim().length > 500) {
            newErrors.productDescription = 'Product description cannot exceed 500 characters';
        }

        // Image validation
        if (formData.productImage) {
            const file = formData.productImage;
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                newErrors.productImage = 'Please upload a valid image file (JPEG, PNG, GIF, or SVG)';
            } else if (file.size > maxSize) {
                newErrors.productImage = 'Image size should be less than 5MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const formDataToSend = new FormData();
        
        // Convert price and quantity to numbers before sending
        formDataToSend.append('productId', formData.productId.trim());
        formDataToSend.append('productName', formData.productName.trim());
        formDataToSend.append('productPrice', parseFloat(formData.productPrice));
        formDataToSend.append('productQuantity', parseInt(formData.productQuantity));
        formDataToSend.append('productDescription', formData.productDescription.trim());
        formDataToSend.append('category', formData.category.trim());
        if (formData.productImage) {
            formDataToSend.append('productImage', formData.productImage);
        }

        // Log the form data being sent
        console.log('Form data being sent:', Object.fromEntries(formDataToSend));

        try {
            const response = await axios.post('http://localhost:5000/api/inventory', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response from server:', response.data);
            toast.success('Inventory item added successfully!');
            navigate('/inventory-list');
        } catch (error) {
            console.error('Error adding inventory item:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                
                // Handle validation errors
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    const validationErrors = error.response.data.errors;
                    console.log('Validation errors:', validationErrors);
                    validationErrors.forEach(err => {
                        if (err.msg) {
                            console.log('Error message:', err.msg);
                            toast.error(err.msg);
                        } else if (err.message) {
                            console.log('Error message:', err.message);
                            toast.error(err.message);
                        }
                    });
                } else if (error.response.data.message) {
                    console.log('Error message:', error.response.data.message);
                    toast.error(error.response.data.message);
                } else {
                    console.log('No specific error message found');
                    toast.error('Failed to add inventory item. Please check your input.');
                }
            } else {
                console.error('No response received from server');
                toast.error('Network error. Please check your connection and try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/inventory-list');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
        >
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-center text-green-700">Add Inventory Item</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label htmlFor="productId" className="block text-gray-700 text-sm font-bold mb-2">Product ID</label>
                        <input
                            type="text"
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productId ? 'border-red-500' : ''}`}
                        />
                        {errors.productId && <p className="text-red-500 text-xs italic">{errors.productId}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productName ? 'border-red-500' : ''}`}
                        />
                        {errors.productName && <p className="text-red-500 text-xs italic">{errors.productName}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.category ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a category</option>
                            <option value="oils">Oils</option>
                            <option value="vehicle lights">Vehicle lights</option>
                            <option value="shock absorbers">Shock Absorbers</option>
                            <option value="tire">Tire</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="productPrice" className="block text-gray-700 text-sm font-bold mb-2">Product Price (Rs.)</label>
                        <input
                            type="number"
                            id="productPrice"
                            name="productPrice"
                            value={formData.productPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productPrice ? 'border-red-500' : ''}`}
                        />
                        {errors.productPrice && <p className="text-red-500 text-xs italic">{errors.productPrice}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="productQuantity" className="block text-gray-700 text-sm font-bold mb-2">Product Quantity</label>
                        <input
                            type="number"
                            id="productQuantity"
                            name="productQuantity"
                            value={formData.productQuantity}
                            onChange={handleChange}
                            min="0"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productQuantity ? 'border-red-500' : ''}`}
                        />
                        {errors.productQuantity && <p className="text-red-500 text-xs italic">{errors.productQuantity}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
                        <textarea
                            id="productDescription"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleChange}
                            rows="3"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productDescription ? 'border-red-500' : ''}`}
                        />
                        {errors.productDescription && <p className="text-red-500 text-xs italic">{errors.productDescription}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="productImage" className="block text-gray-700 text-sm font-bold mb-2">Product Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="productImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaImage className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                </div>
                                <input
                                    id="productImage"
                                    type="file"
                                    name="productImage"
                                    className="hidden"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                            </label>
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover rounded ml-4" />
                            )}
                        </div>
                        {errors.productImage && <p className="text-red-500 text-xs italic">{errors.productImage}</p>}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default InventoryForm;