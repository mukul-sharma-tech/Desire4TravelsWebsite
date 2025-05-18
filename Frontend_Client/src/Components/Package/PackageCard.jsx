import React, { useState } from "react";
import "./PackageCard.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ id, imgSrc, packageName, destinations, price, duration }) => {
  const navigate = useNavigate();
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [fullName, setFullName] = useState("");

  const formattedPrice = isNaN(parseFloat(price)) ? "N/A" : `₹${parseFloat(price).toLocaleString()}`;

  // ✅ Fixed destinations handling
  const locations = Array.isArray(destinations) && destinations.filter(Boolean).length > 0
    ? destinations.filter(Boolean).join(" | ")
    : "No Destinations Available";

  const handleCallbackRequest = (e) => {
    e.stopPropagation();
    setShowCallbackForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Mobile:", mobileNumber, "Full Name:", fullName);
    setShowCallbackForm(false);
    setMobileNumber("");
    setFullName("");
  };

  const handleCardClick = () => {
    console.log(`Navigating to: /package/${id}`);
    navigate(`/package/${id}`);
  };

  return (
    <div className="package-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <img src={imgSrc} alt={packageName} className="package-image" />
      <div className="card-content">
        <h2 className="package-title" title={packageName}>
          {packageName.length > 25 ? `${packageName.slice(0, 25)}...` : packageName}
        </h2>

        <p className="location">
          <FaMapMarkerAlt /> {locations}
        </p>
        <p className="price">{formattedPrice}</p>
        <p className="duration">{duration}</p>
        <button className="request-btn" onClick={handleCallbackRequest}>Request Call Back</button>

        {showCallbackForm && (
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
