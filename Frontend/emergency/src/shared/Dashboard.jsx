import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

function Dashboard() {
  const images = [
    './background.png',
    './test2.png',
    './test3.png',
    './test4.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="car-image mt-0">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt=""
          className="mx-auto max-w-full h-auto rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>

      <main className="main-content text-center py-16 px-6 bg-gray-100">
        <motion.div
          className="hero-section max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">28 Years of Excellence</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">Since 1994</p>
          <p className="text-lg md:text-xl text-gray-600">Guaranteed 100% Satisfaction</p>
          <p className="text-lg md:text-xl text-gray-600">Leads with 40 Centres in Sri Lanka</p>
          <motion.button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
