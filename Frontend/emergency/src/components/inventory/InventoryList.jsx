import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryList = () => {
    const navigate = useNavigate();
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);

    // Define categories
    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'oils', label: 'Oils' },
        { value: 'vehicle lights', label: 'Vehicle Lights' },
        { value: 'shock absorbers', label: 'Shock Absorbers' },
        { value: 'tire', label: 'Tire' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    useEffect(() => {
        filterInventory();
    }, [inventoryItems, searchTerm, categoryFilter, priceFilter]);

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/inventory');
            setInventoryItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory items:", error);
            toast.error("Failed to load inventory list.");
            setLoading(false);
        }
    };

    const filterInventory = () => {
        let filtered = [...inventoryItems];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.productId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        // Apply price filter
        if (priceFilter) {
            filtered = filtered.filter(item => item.productPrice <= parseFloat(priceFilter));
        }

        setFilteredInventory(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:5000/api/inventory/${id}`);
                toast.success('Inventory item deleted successfully');
                fetchInventoryItems();
            } catch (error) {
                console.error('Error deleting inventory item:', error);
                toast.error('Failed to delete inventory item');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-inventory/${id}`);
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Inventory Report', 105, 20, { align: 'center' });
        
        // Add date
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
        
        // Add company info
        doc.setFontSize(14);
        doc.text('Vehicle Service Center', 105, 40, { align: 'center' });
        
        // Add table
        doc.autoTable({
            startY: 50,
            head: [['Product ID', 'Name', 'Category', 'Price (Rs.)', 'Quantity', 'Description']],
            body: filteredInventory.map(item => [
                item.productId,
                item.productName,
                item.category || 'N/A',
                item.productPrice.toFixed(2),
                item.productQuantity,
                item.productDescription || 'N/A'
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [34, 139, 34], // Green color
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 25 }, // Product ID
                1: { cellWidth: 40 }, // Name
                2: { cellWidth: 30 }, // Category
                3: { cellWidth: 25 }, // Price
                4: { cellWidth: 25 }, // Quantity
                5: { cellWidth: 45 }  // Description
            }
        });

        // Add summary
        const finalY = doc.lastAutoTable.finalY || 50;
        doc.setFontSize(12);
        doc.text('Summary', 14, finalY + 20);
        
        const totalItems = filteredInventory.length;
        const totalValue = filteredInventory.reduce((sum, item) => sum + (item.productPrice * item.productQuantity), 0);
        const lowStockItems = filteredInventory.filter(item => item.productQuantity < 10).length;
        
        doc.setFontSize(10);
        doc.text(`Total Items: ${totalItems}`, 14, finalY + 30);
        doc.text(`Total Inventory Value: Rs. ${totalValue.toFixed(2)}`, 14, finalY + 40);
        doc.text(`Low Stock Items (less than 10): ${lowStockItems}`, 14, finalY + 50);
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }

        // Save the PDF
        doc.save('inventory_report.pdf');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPriceFilter('');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-green-700">Inventory Management</h2>
                    <div className="flex gap-4">
                        <Link to="/inventory-form" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                            <FaPlus className="mr-2" /> Add New Item
                        </Link>
                        <button
                            onClick={handleDownload}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
                        >
                            <FaDownload className="mr-2" /> Download Report
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or ID..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (Rs.)</label>
                            <input
                                type="number"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                placeholder="Enter maximum price..."
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <FaFilter className="mr-2" /> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading inventory...</p>
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No inventory items found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredInventory.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.productImage ? (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-gray-400">No Image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.productId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.productPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.productQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item._id)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                                >
                                                    <FaEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                                                >
                                                    <FaTrash className="mr-1" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default InventoryList;