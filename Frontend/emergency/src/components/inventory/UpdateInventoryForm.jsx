import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateInventoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        productPrice: 0,
        productQuantity: 0,
        productDescription: '',
        category: 'oils', // Default category
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchInventoryItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/inventory/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching inventory item data:', error);
                toast.error('Failed to load inventory item data.');
            }
        };
        fetchInventoryItem();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        let isValid = true;

        if (!formData.productId.trim()) {
            formErrors.productId = 'Product ID is required.';
            isValid = false;
        }

        if (!formData.productName.trim()) {
            formErrors.productName = 'Product name is required.';
            isValid = false;
        }

        if (formData.productPrice <= 0) {
            formErrors.productPrice = 'Product price must be greater than 0.';
            isValid = false;
        }

        if (formData.productQuantity < 0) {
            formErrors.productQuantity = 'Product quantity cannot be negative.';
            isValid = false;
        }

        setErrors(formErrors);

        if (!isValid) {
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/inventory/${id}`, formData);
            toast.success('Inventory item updated successfully!');
            navigate('/inventory-list');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorData = error.response.data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {});
                setErrors(errorData);
            } else {
                toast.error('Failed to update inventory item.');
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-teal-500 to-lime-600">
            <div className="w-full max-w-4xl p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-green-700">Update Inventory Item</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="productId" className="block font-medium mb-1">Product ID</label>
                        <input
                            type="text"
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter product ID"
                        />
                        {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
                    </div>

                    <div>
                        <label htmlFor="productName" className="block font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter product name"
                        />
                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                    </div>

                    <div>
                        <label htmlFor="productPrice" className="block font-medium mb-1">Product Price</label>
                        <input
                            type="number"
                            id="productPrice"
                            name="productPrice"
                            value={formData.productPrice}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter product price"
                        />
                        {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
                    </div>

                    <div>
                        <label htmlFor="productQuantity" className="block font-medium mb-1">Product Quantity</label>
                        <input
                            type="number"
                            id="productQuantity"
                            name="productQuantity"
                            value={formData.productQuantity}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter product quantity"
                        />
                        {errors.productQuantity && <p className="text-red-500 text-sm mt-1">{errors.productQuantity}</p>}
                    </div>

                    <div>
                        <label htmlFor="productDescription" className="block font-medium mb-1">Product Description</label>
                        <textarea
                            id="productDescription"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter a description"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label htmlFor="category" className="block font-medium mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="electronics">Oils</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="furniture">Furniture</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition-colors duration-300"
                    >
                        Update
                    </button>

                    <button
                       
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateInventoryForm;