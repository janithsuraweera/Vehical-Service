import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleVehicleErrorsClick = () => {
        navigate('/vehicle-errors');
        setIsMenuOpen(false);
    };

    const handleEmergencyClick = () => {
        navigate('/emergency');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    වාහන සේවා
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
                </div>

                <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                            මුල් පිටුව
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-links vehicle-errors-btn" onClick={handleVehicleErrorsClick}>
                            වාහන දෝෂ
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-links emergency-btn" onClick={handleEmergencyClick}>
                            අනතුරු
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar; 