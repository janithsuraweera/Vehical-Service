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
    });
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setPreviewImage(null);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
        });
        setPreviewImage(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.productId) newErrors.productId = 'Product ID is required';
        if (!formData.productName) newErrors.productName = 'Product Name is required';
        if (!formData.productPrice) newErrors.productPrice = 'Product Price is required';
        if (!formData.productQuantity) newErrors.productQuantity = 'Product Quantity is required';
        if (!formData.productDescription) newErrors.productDescription = 'Product Description is required';
        if (!formData.productImage) newErrors.productImage = 'Product Image is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axios.post('http://localhost:5000/api/inventory', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Inventory item added successfully!');
            navigate('/inventory');
        } catch (error) {
            console.error('Error adding inventory item:', error);
            toast.error('Failed to add inventory item.');
        }
    };

    const handleBack = () => {
        navigate('/inventory');
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
                        <input type="text" id="productId" name="productId" value={formData.productId} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {errors.productId && <p className="text-red-500 text-xs italic">{errors.productId}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                        <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {errors.productName && <p className="text-red-500 text-xs italic">{errors.productName}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productPrice" className="block text-gray-700 text-sm font-bold mb-2">Product Price</label>
                        <input type="number" id="productPrice" name="productPrice" value={formData.productPrice} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {errors.productPrice && <p className="text-red-500 text-xs italic">{errors.productPrice}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productQuantity" className="block text-gray-700 text-sm font-bold mb-2">Product Quantity</label>
                        <input type="number" id="productQuantity" name="productQuantity" value={formData.productQuantity} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {errors.productQuantity && <p className="text-red-500 text-xs italic">{errors.productQuantity}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
                        <textarea id="productDescription" name="productDescription" value={formData.productDescription} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {errors.productDescription && <p className="text-red-500 text-xs italic">{errors.productDescription}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="productImage" className="block text-gray-700 text-sm font-bold mb-2">Product Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="productImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FaImage className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="productImage" type="file" name="productImage" className="hidden" onChange={handleChange} />
                            </label>
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover rounded ml-4" />
                            )}
                        </div>
                        {errors.productImage && <p className="text-red-500 text-xs italic">{errors.productImage}</p>}
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">Add</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default InventoryForm;