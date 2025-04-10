import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './Cart'; // Cart component එක ආනයනය කරන්න

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-4xl font-bold mb-10 text-center text-purple-700">Products</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 shadow-md">
                            <img src={product.productImage} alt={product.productName} className="w-full h-40 object-cover rounded mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
                            <p>Price: Rs. {product.productPrice}</p>
                            <p>Quantity: {product.productQuantity}</p>
                            <p>{product.productDescription}</p>
                            <button onClick={() => addToCart(product)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

                <Cart cart={cart} />
            </div>
        </div>
    );
};

export default ProductDisplay;