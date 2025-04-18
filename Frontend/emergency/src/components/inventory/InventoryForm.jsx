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

    //resets everything back to empty or default values

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
        e.preventDefault();   //Stops the form from refreshing the page
        const newErrors = {};  //Creates a blank object to store any input errors
        if (!formData.productId) newErrors.productId = 'Product ID is required';  //Field Checks
        if (!formData.productName) newErrors.productName = 'Product Name is required';
        if (!formData.productPrice) newErrors.productPrice = 'Product Price is required';
        if (!formData.productQuantity) newErrors.productQuantity = 'Product Quantity is required';
        if (!formData.productDescription) newErrors.productDescription = 'Product Description is required';
        if (!formData.productImage) newErrors.productImage = 'Product Image is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
