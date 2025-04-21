import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './Cart';

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/inventory');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load product list.");
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        toast.success(`${product.productName} added to cart!`);
    };

    
};

export default ProductDisplay;