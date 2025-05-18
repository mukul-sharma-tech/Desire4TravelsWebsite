import React, { useState, useEffect } from 'react';
import './PopUp.css';
import Popup from '../assets/Popup.png';

export default function PopUp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('travelPopupDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('travelPopupDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-form">
          <h2>Plan Your Next Journey</h2>
          <input type="tel" placeholder="Mobile Number" required />
          <input type="text" placeholder="Where do you want to go?" required />
          <button>Talk with Our Travel Experts</button>
          <button className="popup-cancel" onClick={handleClose}>Cancel</button>
        </div>
        <div className="popup-image">
          <img
            src={Popup}
            alt="Travel"
          />
        </div>
      </div>
    </div>
  );
}
