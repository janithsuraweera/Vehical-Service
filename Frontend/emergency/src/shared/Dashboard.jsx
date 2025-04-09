import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

      <div className="car-image mt-12 relative h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentImageIndex]}
            src={images[currentImageIndex]}
            alt="slideshow"
            className="absolute max-w-full max-h-full rounded-xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>

      <main className="main-content text-center py-16 px-6 bg-gray-100">
        <motion.div
          className="hero-section max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">28 Years of Excellence</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">Since 1994</p>
          <p className="text-lg md:text-xl text-gray-600">Guaranteed 100% Satisfaction</p>
          <p className="text-lg md:text-xl text-gray-600">Leads with 40 Centres in Sri Lanka</p>

          <motion.button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-md"
            whileHover={{ scale: 1.05 }}
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
