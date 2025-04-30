import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../../assets/background.png';
import { FaArrowLeft, FaImage } from 'react-icons/fa';

const InventoryUpdateForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        productPrice: '',
        productQuantity: '',
        productDescription: '',
        category: '',
        productImage: null
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { value: 'oils', label: 'Oils' },
        { value: 'vehicle lights', label: 'Vehicle Lights' },
        { value: 'shock absorbers', label: 'Shock Absorbers' },
        { value: 'tire', label: 'Tire' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        const fetchInventoryItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/inventory/${id}`);
                const item = response.data;
                setFormData({
                    productId: item.productId,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productQuantity: item.productQuantity,
                    productDescription: item.productDescription,
                    category: item.category,
                    productImage: null
                });
                if (item.productImage) {
                    setImagePreview(item.productImage);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inventory item:', error);
                toast.error('Failed to load inventory item');
                navigate('/inventory');
            }
        };

        fetchInventoryItem();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                productImage: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productId) newErrors.productId = 'Product ID is required';
        if (!formData.productName) newErrors.productName = 'Product name is required';
        if (!formData.productPrice) newErrors.productPrice = 'Product price is required';
        if (!formData.productQuantity) newErrors.productQuantity = 'Product quantity is required';
        if (!formData.category) newErrors.category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await axios.put(`http://localhost:5000/api/inventory/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Inventory item updated successfully');
            navigate('/inventory-List');
        } catch (error) {
            console.error('Error updating inventory item:', error);
            toast.error('Failed to update inventory item');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
        >
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-center text-green-700">Update Inventory Item</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="productId" className="block text-gray-700 text-sm font-bold mb-2">Product ID</label>
                        <input
                            type="text"
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                        />
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
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
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
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded ml-4" />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/inventory')}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default InventoryUpdateForm; 