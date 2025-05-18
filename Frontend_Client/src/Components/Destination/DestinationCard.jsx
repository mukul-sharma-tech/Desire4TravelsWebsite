// DestinationCard.jsx
import React, { useState } from 'react';
import './DestinationCard.css';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DestinationCard = ({ imgSrc, title, location, tripType, rating, onClick }) => {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleCallbackRequest = (e) => {
    e.stopPropagation();
    setShowCallbackForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mobile:', mobileNumber);
    setShowCallbackForm(false);
  };

  return (
    <div className="destination-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={imgSrc} alt={title} className="destination-image" />
      <div className="card-content">
        <h2 className="destination-title">{title}</h2>
        <p className="location"><FaMapMarkerAlt /> {location}</p>
        {tripType && (
          <p className="trip-type">
            Type: {Array.isArray(tripType) ? tripType.join(', ') : tripType}
          </p>
        )}
        <p className="rating"><FaStar className="star-icon" /> {rating} / 5</p>
        <button className="request-btn" onClick={handleCallbackRequest}>Request Call Back</button>
        
        {showCallbackForm && (
          <div className="callback-form-overlay" onClick={(e) => e.stopPropagation()}>
            <form className="callback-form" onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
              <div>
                <Link to="/signup" className="signup-link">Sign up for updates</Link>
              </div>
              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowCallbackForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
