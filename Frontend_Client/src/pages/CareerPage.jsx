import React from "react";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./CareerPage.css";

const CareerPage = () => {
  return (
    <div className="career-page">
      {/* Full-width colored background */}
      <div className="career-hero">
        <div className="career-hero-content">
          <h1>Join the Desire4Travels Team!</h1>
          <p>Help us create unforgettable travel experiences</p>
        </div>
      </div>

      {/* Main content container */}
      <div className="career-content-wrapper">
        <div className="career-container">
          {/* Why Join Us? */}
          <div className="career-section">
            <h2>Why Join Us?</h2>
            <ul className="career-list">
              <li>🌍 Work in a dynamic and growing travel company</li>
              <li>🚀 Opportunities for skill development and career growth</li>
              <li>❤️ Be part of a passionate team that loves travel</li>
            </ul>
          </div>

          {/* Current Openings */}
          <div className="career-section">
            <h2>Current Openings</h2>
            <p>We're hiring for the following roles:</p>
            <ul className="career-list">
              <li>🧳 Travel Consultants</li>
              <li>📞 Customer Support Executives</li>
              <li>📈 Sales & Marketing Professionals</li>
              <li>💻 Digital Marketing Specialists</li>
              <li>🚚 Operations & Logistics Coordinators</li>
            </ul>
          </div>

          {/* How to Apply */}
          <div className="career-section">
            <h2>How to Apply?</h2>
            <p>Send your resume and cover letter to:</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon"><FaEnvelope /></span>
                <a href="mailto:info@desire4travels.com">info@desire4travels.com</a>
              </div>
            </div>
            <p className="note">
              <strong>Note:</strong> Mention the position you're applying for in the subject line.
            </p>
          </div>

          {/* Call to Action */}
          <div className="cta">
            <p>We look forward to welcoming you to the Desire4Travels family! ✈️🌍</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
