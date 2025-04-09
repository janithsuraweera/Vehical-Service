import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
        <div className="logo">
      
          <img src="motron-logo.png" alt="Motron Logo" className="h-10" />
        </div>
        <div className="nav-items hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">About Us</a>
          <a href="#" className="hover:text-gray-400">Services</a>
          <a href="#" className="hover:text-gray-400">Branches</a>
          <a href="#" className="hover:text-gray-400">Packages</a>
          <a href="#" className="hover:text-gray-400">News</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
        </div>
        <div className="nav-buttons space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Sign In</button>
        </div>
      </nav>

      <main className="main-content text-center py-16 px-6 bg-gray-100">
        <div className="hero-section max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">28 Years of Excellence</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">Since 1994</p>
          <p className="text-lg md:text-xl text-gray-600">Guaranteed 100% Satisfaction</p>
          <p className="text-lg md:text-xl text-gray-600">Leads with 40 Centres in Sri Lanka</p>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">Learn More</button>
        </div>
        <div className="car-image mt-12">
          {/* <img src="../assets/background.png" alt="Red Car" className="mx-auto max-w-full h-auto" /> */}
        </div>
      </main>

      {/* <footer className="footer bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Motron</p>
      </footer> */}
    </div>
  );
}

export default Dashboard;
//dashboard.jsx