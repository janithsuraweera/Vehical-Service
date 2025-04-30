import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaArrowLeft, FaDownload, FaPlus } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryList = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
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

    const handleAddNew = () => {
        navigate('/add-inventory');
    };

    const handleBack = () => {
        navigate('/inventory');
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedItems = inventoryItems
        .filter(item => {
            const searchMatch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.productId?.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = categoryFilter ? item.category === categoryFilter : true;
            const priceMatch = priceFilter ? item.productPrice <= parseFloat(priceFilter) : true;
            return searchMatch && categoryMatch && priceMatch;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.productName.localeCompare(b.productName);
                    break;
                case 'price':
                    comparison = a.productPrice - b.productPrice;
                    break;
                case 'quantity':
                    comparison = a.productQuantity - b.productQuantity;
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Product ID', 'Product Name', 'Price', 'Quantity', 'Description', 'Category']],
            body: filteredAndSortedItems.map(item => [
                item.productId,
                item.productName,
                item.productPrice,
                item.productQuantity,
                item.productDescription,
                item.category || 'N/A'
            ]),
        });
        doc.save('inventory_report.pdf');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-teal-500 to-lime-600 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-green-700">Inventory Management</h2>
                    <div className="flex gap-4">
                        <Link to="/inventory-form" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                            <FaPlus className="mr-2" /> Add New Item
                        </Link>
                        <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                            <FaDownload className="mr-2" /> Download Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search by Product ID or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="categoryFilter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            <option value="oils">Oils</option>
                            <option value="vehicle lights">Vehicle lights</option>
                            <option value="shock absorbers">Shock Absorbers</option>
                            <option value="tire">Tire</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priceFilter" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            id="priceFilter"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            placeholder="Enter max price"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Inventory List</h2>
                    </div>
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-6 border-b text-left">
                                    <button
                                        onClick={() => handleSort('name')}
                                        className="flex items-center text-lg font-semibold text-gray-700"
                                    >
                                        Product Name
                                        {sortBy === 'name' && (
                                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </button>
                                </th>
                                <th className="py-3 px-6 border-b text-left">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="flex items-center text-lg font-semibold text-gray-700"
                                    >
                                        Price
                                        {sortBy === 'price' && (
                                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </button>
                                </th>
                                <th className="py-3 px-6 border-b text-left">
                                    <button
                                        onClick={() => handleSort('quantity')}
                                        className="flex items-center text-lg font-semibold text-gray-700"
                                    >
                                        Quantity
                                        {sortBy === 'quantity' && (
                                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </button>
                                </th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Description</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Image</th>
                                <th className="py-3 px-6 border-b text-left text-lg font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedItems.length > 0 ? (
                                filteredAndSortedItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-green-50">
                                        <td className="py-4 px-6 border-b">
                                            <Link to={`/inventory/${item._id}`} className="text-black-600 hover:text-green-600">
                                                {item.productName}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6 border-b">Rs. {item.productPrice}</td>
                                        <td className="py-4 px-6 border-b">{item.productQuantity}</td>
                                        <td className="py-4 px-6 border-b">{item.productDescription}</td>
                                        <td className="py-4 px-6 border-b">
                                            <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded" />
                                        </td>
                                        <td className="py-4 px-6 border-b">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdate(item._id)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded flex items-center"
                                                >
                                                    <FaEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded flex items-center"
                                                >
                                                    <FaTrash className="mr-1" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-4 px-6 text-center text-gray-500">No items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleBack}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryList;