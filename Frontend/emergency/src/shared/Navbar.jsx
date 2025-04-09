import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
      <div className="logo">
        <img src="./logo.png" alt="Motron Logo" className="h-14" />
      </div>
      <div className="nav-items hidden md:flex space-x-6">
        <a href="/" className="hover:text-gray-400">Home</a>
        <a href="/inventory" className="hover:text-gray-400">Store</a>
        <a href="/emergency" className="hover:text-gray-400">Emergency</a>
        <a href="#" className="hover:text-gray-400">About Us</a>
      </div>
      <div className="nav-buttons space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
