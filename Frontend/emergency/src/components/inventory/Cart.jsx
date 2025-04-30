import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/inventory');
                setInventoryItems(response.data);
            } catch (error) {
                console.error("Error fetching inventory items:", error);
                toast.error("Failed to load inventory items.");
            }
        };
        fetchInventoryItems();
    }, []);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
        toast.success(`${item.productName} added to cart!`);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
        toast.info("Item removed from cart!");
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item =>
            item._id === itemId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const total = cart.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);

    return (
        <div className="flex flex-col md:flex-row gap-8 p-4">
            {/* Inventory Items */}
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Available Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventoryItems.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={item.productImage} alt={item.productName} className="w-full h-48 object-cover rounded mb-4" />
                            <h3 className="text-lg font-semibold">{item.productName}</h3>
                            <p className="text-gray-600">Rs. {item.productPrice}</p>
                            <p className="text-sm text-gray-500 mb-2">{item.productDescription}</p>
                            <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div className="w-full md:w-96 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center border-b py-2">
                                <div>
                                    <h3 className="font-semibold">{item.productName}</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p>Rs. {item.productPrice * item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>Rs. {total}</span>
                            </div>
                            <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;