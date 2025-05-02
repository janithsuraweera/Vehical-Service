import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Motrone</h3>
            <p className="text-sm text-gray-400">
              We provide high-quality services and solutions to meet your needs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>              
              <li><a href="/contact" className="hover:text-white">Store</a></li>
              <li><a href="/emergency" className="hover:text-white">Emergency</a></li>
              <li><a href="/aboutus" className="hover:text-white">About Us</a></li>
              <li><a href="/aboutus" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">15 Eramudugaha Junction,Unawatuna</p>
            <p className="text-sm text-gray-400">Email: info@motron.com</p>
            <p className="text-sm text-gray-400">Phone: +94 76 206 0052</p>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="www.facebook.com" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
              <a href="www.twitter.com" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
              <a href="www.instagram.com" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
              <a href="www.linkedin.com" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">&copy; 2025 Motron. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;