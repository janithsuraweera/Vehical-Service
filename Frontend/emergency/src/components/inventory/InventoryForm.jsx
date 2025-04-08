// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import backgroundImage from '../../assets/background.png';
// import { FaArrowLeft, FaImage } from 'react-icons/fa';

// const InventoryForm = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         productId: '',
//         productName: '',
//         productPrice: '',
//         productQuantity: '',
//         productDescription: '',
//         productImage: null,
//     });
//     const [errors, setErrors] = useState({});
//     const [previewImage, setPreviewImage] = useState(null);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === 'file') {
//             const file = files[0];
//             setFormData({ ...formData, [name]: file });
//             if (file) {
//                 setPreviewImage(URL.createObjectURL(file));
//             } else {
//                 setPreviewImage(null);
//             }
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//         setErrors({ ...errors, [name]: '' });
//     };

//     const resetForm = () => {
//         setFormData({
//             productId: '',
//             productName: '',
//             productPrice: '',
//             productQuantity: '',
//             productDescription: '',
//             productImage: null,
//         });
//         setErrors({});
//         setPreviewImage(null);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let formErrors = {};
//         let isValid = true;

//         if (!formData.productId.trim()) {
//             formErrors.productId = 'Product ID is required.';
//             isValid = false;
//         }

//         if (!formData.productName.trim()) {
//             formErrors.productName = 'Product name is required.';
//             isValid = false;
//         }

//         if (!formData.productPrice) {
//             formErrors.productPrice = 'Product price is required.';
//             isValid = false;
//         }

//         if (!formData.productQuantity) {
//             formErrors.productQuantity = 'Product quantity is required.';
//             isValid = false;
//         }

//         if (!formData.productImage) {
//             formErrors.productImage = 'Product image is required.';
//             isValid = false;
//         }

//         setErrors(formErrors);

//         if (!isValid) {
//             return;
//         }

//         const formDataToSend = new FormData();
//         for (const key in formData) {
//             formDataToSend.append(key, formData[key]);
//         }

//         try {
//             await axios.post('http://localhost:5000/api/inventory', formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             toast.success('Inventory request submitted successfully!');
//             resetForm();
//         } catch (error) {
//             if (error.response && error.response.data && error.response.data.errors) {
//                 const errorData = error.response.data.errors.reduce(
//                     (acc, err) => ({ ...acc, [err.path]: err.msg }),
//                     {}
//                 );
//                 setErrors(errorData);
//             } else {
//                 toast.error('Failed to submit inventory request.');
//             }
//         }
//     };

//     const handleBack = () => {
//         navigate(-1);
//     };

//     return (
//         <div
//             className="min-h-screen bg-cover bg-center flex justify-center items-center"
//             style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.9 }}
//         >
//             <motion.div
//                 className="w-full max-w-4xl p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg mx-auto"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
//                     Inventory Request
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="productId" className="block font-medium mb-1">Product ID</label>
//                         <input
//                             type="text"
//                             id="productId"
//                             name="productId"
//                             value={formData.productId}
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter product ID"
//                         />
//                         {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="productName" className="block font-medium mb-1">Product Name</label>
//                         <input
//                             type="text"
//                             id="productName"
//                             name="productName"
//                             value={formData.productName}
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter product name"
//                         />
//                         {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="productPrice" className="block font-medium mb-1">Product Price</label>
//                         <input
//                             type="number"
//                             id="productPrice"
//                             name="productPrice"
//                             value={formData.productPrice}
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter product price"
//                         />
//                         {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="productQuantity" className="block font-medium mb-1">Product Quantity</label>
//                         <input
//                             type="number"
//                             id="productQuantity"
//                             name="productQuantity"
//                             value={formData.productQuantity}
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter product quantity"
//                         />
//                         {errors.productQuantity && <p className="text-red-500 text-sm mt-1">{errors.productQuantity}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="productDescription" className="block font-medium mb-1">Product Description</label>
//                         <textarea
//                             id="productDescription"
//                             name="productDescription"
//                             value={formData.productDescription}
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                             placeholder="Enter product description"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="productImage" className="block font-medium mb-1">Product Image</label>
//                         <input
//                             type="file"
//                             id="productImage"
//                             name="productImage"
//                             onChange={handleChange}
//                             className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
//                         />
//                         {errors.productImage && <p className="text-red-500 text-sm mt-1">{errors.productImage}</p>}
//                         {previewImage && (
//                             <div className="mt-2">
//                                 <img src={previewImage} alt="Preview" className="max-w-xs" />
//                             </div>
//                         )}
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition-colors duration-300"
//                     >
//                         Submit
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleBack}
//                         className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg w-full mt-4 transition-colors duration-300 flex items-center justify-center"
//                     >
//                         <FaArrowLeft className="mr-2" /> Back
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default InventoryForm;