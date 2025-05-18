import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTripTypeChange = (e) => {
    const selectedType = e.target.value;
    if (selectedType) {
      navigate(`/triptype/${selectedType}`);
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="nav">
      <div className="nav-logo">Desire<span>4</span>Travels</div>

      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-container ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/destination" className="nav-link" onClick={handleLinkClick}>Destinations</Link></li>
          <li className="dropdown">
            <select onChange={handleTripTypeChange} defaultValue="">
              <option value="" disabled>Type of Trip</option>
              <option value="mountain">Mountain</option>
              <option value="beach">Beach</option>
              <option value="religious">Religious</option>
              <option value="heritage">Heritage</option>
              <option value="offbeat">Offbeat</option>
              <option value="other">Other</option>
            </select>
          </li>
          <li><Link to="/package" className="nav-link" onClick={handleLinkClick}>Packages</Link></li>
          <li><Link to="/blogs" className="nav-link" onClick={handleLinkClick}>Blogs</Link></li>
          <li><Link to="/careerpage" className="nav-link" onClick={handleLinkClick}>Career</Link></li>

          <li><Link to="/contact" className="nav-link" onClick={handleLinkClick}>Contact</Link></li>
        </ul>

        <ul className="nav-auth">
          <li className='nav-login'>
            <Link to="/login" className="nav-link" onClick={handleLinkClick}>
              <p className='login'>Login</p>
            </Link>
          </li>
          <li><Link to="/signup" className="nav-link" onClick={handleLinkClick}>Signup</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
