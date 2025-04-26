import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer';

const About = () => {
  return (
    
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="py-0 bg-gray-100"
    >
        
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 mb-8">
            We are a team of passionate individuals dedicated to providing high-quality services. With years of experience and a commitment to excellence, we strive to exceed our customers' expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To deliver innovative solutions and exceptional service that empower our clients to achieve their goals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be a leading provider in our industry, recognized for our commitment to quality, integrity, and customer satisfaction.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Integrity</li>
              <li>Excellence</li>
              <li>Innovation</li>
              <li>Teamwork</li>
              <li>Customer Focus</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full "
          >
            Learn More About Our Team
          </motion.button>
        </div>
      </div>
      <Footer />
    </motion.section>
    
  );

};

export default About;