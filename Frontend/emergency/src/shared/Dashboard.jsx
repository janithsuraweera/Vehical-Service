// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Navbar from './Navbar';
// import Footer from './Footer';

// function Dashboard() {
//     const imageData = [
//         {
//             image: './background.png',
//             title: 'Expert Vehicle Maintenance',         
//             description: 'Guaranteed 100% Satisfaction',
//         },
//         {
//             image: './test2.png',
//             title: 'Trusted Service Center',
//             description: 'Trust 100% for Your Vehicle',
//         },
//         {
//             image: './test3.png',
//             title: 'Quality Auto Repairs',
//             description: 'Reliable and Professional',
//         },
//         {
//             image: './test4.png',
//             title: 'Premium Car Care',
//             description: 'Your Vehicle Deserves the Best',
//         },
//     ];

//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageData.length);
//         }, 10000); 
//         return () => clearInterval(intervalId);
//     }, [imageData.length]);

//     return (
//       <div className="dashboard">
//           <Navbar />

//           <div className="relative mt-0">
//               <AnimatePresence initial={false} mode="wait">
//                   <motion.div
//                       key={currentImageIndex}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 1, ease: 'easeInOut' }}
//                       className="relative"
//                   >
//                       <img
//                           src={imageData[currentImageIndex].image}
//                           alt="Slideshow Image"
//                           className="mx-auto w-full h-[250px] md:h-[600px] object-cover shadow-lg"
//                       />
//                       <motion.div
//                           initial={{ opacity: 0, y: 200 }}
//                           animate={{ opacity: 1, y: 5 }}
//                           exit={{ opacity: 0, y: -50 }}
//                           transition={{ duration: 0.5, ease: 'easeInOut' }}

//                           // className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-10 bg-black bg-opacity-50 rounded-lg" 
//                           //  className="absolute top-1/2 left-10 transform -translate-y-1/2 text-left text-white p-10 bg-black bg-opacity-50 rounded-lg"//Center-Lef
//                            // className="absolute bottom-10 left-10 text-left text-white p-10 bg-black bg-opacity-50 rounded-lg" // Top-Right Corner
                           
//                           className="absolute top-10 left-10 text-left text-white p-3 bg-black bg-opacity-50 rounded-lg" // Top-Left Corner

                         
//                       >
                          
                         
//                           <h2 className="text-2xl md:text-4xl font-bold mb-2">
//                               {imageData[currentImageIndex].title}

//                           </h2>
//                           <p className="text-lg md:text-xl">
//                               {imageData[currentImageIndex].description}
//                           </p>



//                       </motion.div>
//                   </motion.div>
//               </AnimatePresence>
//           </div>

//           <main className="main-content text-center py-16 px-6 bg-gray-100">
//               <motion.div
//                   className="hero-section max-w-4xl mx-auto"
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 1, ease: 'easeInOut' }}
//               >
//                   <h1 className="text-4xl md:text-6xl font-bold text-gray-800">28 Years of Excellence</h1>
//                   <p className="text-lg md:text-xl text-gray-600 mt-4">Since 1994</p>
//                   <p className="text-lg md:text-xl text-gray-600">Guaranteed 100% Satisfaction</p>
//                   <p className="text-lg md:text-xl text-gray-600">Leads with 40 Centres in Sri Lanka</p>
                  
                  
//                   <motion.button
//                       className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-md"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.95 }}
//                   >
//                       Learn More
//                   </motion.button>
//               </motion.div>
//           </main>

//           <Footer />
//       </div>
//   );
// }

// export default Dashboard;