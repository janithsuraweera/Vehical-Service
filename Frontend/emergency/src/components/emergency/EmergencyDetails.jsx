import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useParams, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

// import backgroundImage from './background.png';



const EmergencyDetails = () => {

    const { id } = useParams();

    const [emergency, setEmergency] = useState(null);

    const [status, setStatus] = useState('Pending');

    const navigate = useNavigate();



    useEffect(() => {

        const fetchEmergency = async () => {

            try {

                const response = await axios.get(`http://localhost:5000/api/emergency/${id}`);

                setEmergency(response.data);

                if (response.data.status) {

                    setStatus(response.data.status);

                }

            } catch (error) {

                console.error("Error fetching emergency details:", error);

            }

        };

        fetchEmergency();

    }, [id]);



    const handleBack = () => {

        navigate('/list'); // Navigate to the emergency list page

    };



    const handleOk = async () => {

        try {

            await axios.put(`http://localhost:5000/api/emergency/${id}`, { status: status });

            navigate('/list'); // Navigate back to the emergency list after saving

        } catch (error) {

            console.error("Error updating status:", error);

        }

    };



    if (!emergency) {

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

                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">

                    Emergency Request Details

                </h2>

                <div className="space-y-4">

                    <p><strong>Name:</strong> {emergency.name}</p>

                    <p><strong>Tel:</strong> {emergency.contactNumber}</p>

                    <p><strong>Address:</strong> {emergency.location.address}</p>

                    <p><strong>Vehicle Type:</strong> {emergency.vehicleType}</p>

                    <p><strong>Vehicle Color:</strong> {emergency.vehicleColor}</p>

                    <p><strong>Emergency Type:</strong> {emergency.emergencyType}</p>

                    <p><strong>Description:</strong> {emergency.description}</p>

                    <div className="flex items-center">

                        <strong>Status:</strong>

                        <select

                            value={status}

                            onChange={(e) => setStatus(e.target.value)}

                            className="border p-2 rounded ml-2"

                        >

                            <option value="Pending">Pending</option>

                            <option value="Processing">Processing</option>

                            <option value="Completed">Completed</option>

                        </select>

                    </div>

                    <div className="flex justify-between mt-6">

                        <button

                            onClick={handleBack}

                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"

                        >

                            Back

                        </button>

                        <button

                            onClick={handleOk}

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"

                        >

                            OK

                        </button>

                    </div>

                </div>

            </motion.div>

        </div>

    );

};



export default EmergencyDetails;