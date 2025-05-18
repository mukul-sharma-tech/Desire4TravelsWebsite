import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PackageDetails.css";
import Hotel from "../assets/Hotel.png";
import Taxi from "../assets/Taxi.png";
import Sightseeing from "../assets/Sightseeing.png";

const PackageDetails = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/packages/${packageId}`);
        setPackageData(response.data);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  if (loading) return <div className="package-details-loading">Loading...</div>;
  if (error) return <div className="package-details-error">{error}</div>;
  if (!packageData) return <div className="package-details-error">Package not found</div>;

  const {
    packageName,
    duration,
    price,
    photo,
    description,
    inclusions = "",
    itinerary = "",
    destinations = [],
  } = packageData;

  // Parse inclusions string into array
  const inclusionsArray = typeof inclusions === "string"
    ? inclusions.split(";").map(item => item.trim()).filter(Boolean)
    : Array.isArray(inclusions)
    ? inclusions
    : [];

  // Parse itinerary string into array (split by ';')
  const itineraryArray = typeof itinerary === "string"
    ? itinerary.split(";").map(item => item.trim()).filter(Boolean)
    : Array.isArray(itinerary)
    ? itinerary
    : [];

  const dayHeaderRegex = /^day\s*\d+\s*:/i;

  const days = [];
  let currentDay = null;

  itineraryArray.forEach(item => {
    if (dayHeaderRegex.test(item)) {

      if (currentDay) days.push(currentDay);

      currentDay = {
        dayLabel: true,
        fullHeading: item,
        activities: [],
      };
    } else {
      if (currentDay) {
        currentDay.activities.push(item);
      } else {
        days.push({ dayLabel: null, activities: [item] });
      }
    }
  });

  // Push last day if exists
  if (currentDay) days.push(currentDay);

  return (
    <div className="package-details-container">
      <div className="package-details-header-flex">
        <section className="package-details-section">
          <h1 className="package-title">{packageName}</h1>
          <h2 className="package-subtitle">Duration: {duration}</h2>
          <h3 className="package-price">Price: ₹{price}</h3>
        </section>
      </div>
      <div className="package-details-header-flex">
        <img src={photo} alt={packageName} className="package-details-main-image" />
        <div className="package-details-icons">
          <img src={Hotel} alt="Hotel" className="package-icon" />
          <img src={Taxi} alt="Taxi" className="package-icon" />
          <img src={Sightseeing} alt="Sightseeing" className="package-icon" />
        </div>
      </div>

      <div className="package-details-flex-wrapper">
        <div className="package-details-left">
          <section className="package-details-section">
            <h1 className="package-title">About the Package</h1>
            <p className="package-description">{description}</p>
          </section>

          <section className="package-details-section">
            <h1 className="package-title">Inclusions</h1>
            {inclusionsArray.length > 0 ? (
              <ul className="package-details-list">
                {inclusionsArray.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No inclusions available.</p>
            )}
          </section>

          <section className="package-details-section">
            <h1 className="package-title">Itinerary</h1>
            <table className="itinerary-table">
              <tbody>
                {days.length > 0 ? (
                  days.map((day, dayIndex) => (
                    <React.Fragment key={dayIndex}>
                      {day.dayLabel ? (
                        <tr className="itinerary-day-row">
                          <td colSpan="2" style={{ fontWeight: "700" }}>
                            {day.fullHeading}
                          </td>
                        </tr>
                      ) : null}
                      {day.activities.map((act, i) => (
                        <tr key={`${dayIndex}-activity-${i}`} className="itinerary-item-row">
                          <td colSpan="2" style={{ paddingLeft: day.dayLabel ? "20px" : "0" }}>
                            {act}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No itinerary available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div className="package-details-right">
          <section className="package-details-section">
            <h1 className="package-title">Destinations Covered</h1>
            <div className="package-details-destinations-grid">
              {destinations.length > 0 ? (
                destinations.map((dest, index) => (
                  <div key={index} className="package-details-destination-card">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="package-details-destination-image"
                    />
                    <h3>{dest.name}</h3>
                    <p><strong>{dest.state} - {dest.type}</strong></p>
                    <p>⭐ {dest.rating}</p>
                  </div>
                ))
              ) : (
                <p>No destinations available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
      <button className="request-package-button">Request Call Back</button>
    </div>
  );
};

export default PackageDetails;
