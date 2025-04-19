import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryList = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/inventory');
                setInventoryItems(response.data);
            } catch (error) {
                console.error("Error fetching inventory items:", error);
                toast.error("Failed to load inventory list.");
            }
        };
        fetchInventoryItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/inventory/${id}`);
                setInventoryItems(inventoryItems.filter(item => item._id !== id));
                toast.success("Item deleted successfully!");
            } catch (error) {
                console.error("Error deleting item:", error);
                toast.error("Failed to delete item.");
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-inventory/${id}`);
    };

    const handleBack = () => {
        navigate('/inventory');
    };

    const filteredInventoryItems = inventoryItems.filter(item => {
        const searchMatch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productId?.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = categoryFilter ? item.category === categoryFilter : true;
        const priceMatch = priceFilter ? item.productPrice <= parseFloat(priceFilter) : true;
        return searchMatch && categoryMatch && priceMatch;
    });

    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-teal-500 to-lime-600 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-8 text-center text-green-700">Inventory List</h2>

                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="flex space-x-2 mb-2 sm:mb-0">
                        <label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
                        <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2 border rounded">
                            <option value="">All Categories</option>
                            <option value="oils">Oils</option>
                            <option value="vehicle lights">Vehicle lights</option>
                            <option value="shock absorbers">Shock Absorbers</option>
                            <option value="tire">Tire</option>
                        </select>

                        <label htmlFor="priceFilter" className="sr-only">Filter by Max Price</label>
                        <input type="number" id="priceFilter" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} placeholder="Max Price" className="p-2 border rounded" />
                    </div>

                    <label htmlFor="searchTerm" className="sr-only">Search by Product ID or Name</label>
                    <input
                        type="text"
                        id="searchTerm"
                        placeholder="Search by Product ID or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg w-full sm:w-72"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Product ID</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Product Name</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Price</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Quantity</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Description</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Image</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventoryItems.length > 0 ? (
                                filteredInventoryItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-green-50">
                                        <td className="py-4 px-6 border-b">
                                            <Link to={`/inventory/${item._id}`} className="text-black-600 hover:none">
                                                {item.productId}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6 border-b">{item.productName}</td>
                                        <td className="py-4 px-6 border-b">{item.productPrice}</td>
                                        <td className="py-4 px-6 border-b">{item.productQuantity}</td>
                                        <td className="py-4 px-6 border-b">{item.productDescription}</td>
                                        <td className="py-4 px-6 border-b">
                                            <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded" />
                                        </td>
                                        <td className="py-4 px-6 border-b flex space-x-2">
                                            <button onClick={() => handleUpdate(item._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded">
                                                <FaEdit className="inline-block mr-1" /> Update
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded">
                                                <FaTrash className="inline-block mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-4 px-6 text-center">No items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between mt-6">
                    <button onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </button>
                    <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                        <FaDownload className="mr-2" /> Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryList;