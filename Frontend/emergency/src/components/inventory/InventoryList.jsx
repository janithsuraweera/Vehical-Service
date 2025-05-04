import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text('Inventory Report', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
            doc.setFontSize(14);
            doc.text('Vehicle Service Center', 105, 40, { align: 'center' });
            const tableData = filteredInventory.map(item => [
                item.productId || 'N/A',
                item.productName || 'N/A',
                item.category || 'N/A',
                item.productPrice ? item.productPrice.toFixed(2) : '0.00',
                item.productQuantity || '0',
                item.productDescription || 'N/A'
            ]);
            autoTable(doc, {
                startY: 50,
                head: [['Product ID', 'Name', 'Category', 'Price (Rs.)', 'Quantity', 'Description']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [34, 139, 34],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 45 }
                }
            });
            const finalY = doc.lastAutoTable.finalY || 50;
            doc.setFontSize(12);
            doc.text('Summary', 14, finalY + 20);
            const totalItems = filteredInventory.length;
            const totalValue = filteredInventory.reduce((sum, item) => 
                sum + ((item.productPrice || 0) * (item.productQuantity || 0)), 0);
            const lowStockItems = filteredInventory.filter(item => 
                (item.productQuantity || 0) < 10).length;
            doc.setFontSize(10);
            doc.text(`Total Items: ${totalItems}`, 14, finalY + 30);
            doc.text(`Total Inventory Value: Rs. ${totalValue.toFixed(2)}`, 14, finalY + 40);
            doc.text(`Low Stock Items (less than 10): ${lowStockItems}`, 14, finalY + 50);
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            }
            doc.save('inventory_report.pdf');
            toast.success('Report downloaded successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report. Please try again.');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPriceFilter('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="w-full h-full">
                <div className="rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-white bg-opacity-90">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            Inventory Management
                        </h2>
                        <div className="flex gap-4">
                            <Link to="/inventory-form" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300">
                                <FaPlus className="mr-2" /> Add New Item
                            </Link>
                            <button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-2 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 group w-10 hover:w-40 overflow-hidden"
                            >
                                <FaDownload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="absolute opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-5 whitespace-nowrap">
                                    Download Report
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-6 p-4 rounded-xl shadow-lg border bg-white border-gray-100">
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
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
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
                        <div className="text-center py-8 rounded-xl shadow-lg bg-white">
                            <p className="text-gray-600 text-lg">No inventory items found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-lg">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-24">Image</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Product ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Category</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Price (Rs.)</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-32">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-64">Description</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredInventory.map((item) => (
                                        <tr key={item._id} className="group hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-3 whitespace-nowrap">
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
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-sm text-gray-900 group-hover:text-gray-700">{item.productId}</td>
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-sm text-gray-900 group-hover:text-gray-700">{item.productName}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700 capitalize">{item.category}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700">{item.productPrice.toFixed(2)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700">{item.productQuantity}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 group-hover:text-gray-700">{item.productDescription}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="mr-1" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-1.5 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                                                        title="Delete"
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
            </div>
        </div>
    );
};

export default InventoryList;