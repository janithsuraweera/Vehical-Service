import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import backgroundImage from '../assets/background.png';

const InventoryDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/inventory/${id}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching inventory item details:", error);
            }
        };
        fetchItem();
    }, [id]);

    const handleBack = () => {
        navigate('/inventory-list'); // Navigate to the inventory list page
    };

    if (!item) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex justify-center items-center"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
            >
                <motion.div
                    className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
        >
            <motion.div
                className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
                    Inventory Item Details
                </h2>
                <div className="space-y-4">
                    <p><strong>Product ID:</strong> {item.productId}</p>
                    <p><strong>Product Name:</strong> {item.productName}</p>
                    <p><strong>Price:</strong> {item.productPrice}</p>
                    <p><strong>Quantity:</strong> {item.productQuantity}</p>
                    <p><strong>Description:</strong> {item.productDescription}</p>
                    {/* <p><strong>Category:</strong> {item.category}</p> */}

                    <p><strong>Image:</strong>{item.backgroundImage}</p>

                    <div className="flex justify-center mt-6">
                    <button
                            onClick={handleBack}
                            className="bg-gray-520 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back
                        </button> 
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default InventoryDetails;