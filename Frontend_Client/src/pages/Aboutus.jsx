import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>

      <section className="about-section">
        <p>
          <strong>Desire4Travels</strong> is more than just a travel company — it’s a community built by travelers, for travelers. Founded in 2016 by <strong>Ayush Agrawal</strong>, a passionate explorer with an entrepreneurial spirit, Desire4Travels began with a simple goal: to help people experience the joy of meaningful, well-planned travel without the stress and overpricing often associated with it.
        </p>
        <p>
          What started as a personal mission to organize smooth and budget-friendly trips for friends and peers quickly evolved into a trusted brand that today serves hundreds of travelers across PAN India.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">Our Journey</h2>
        <p>
          We’ve curated hundreds of tours across India — from the snow-capped mountains of Spiti, Manali, and Ladakh to the tranquil beaches of Goa and Kerala, the cultural richness of Rajasthan and Varanasi, and the unexplored beauty of the North East and Andaman Islands.
        </p>
        <p>
          Whether you're a solo traveler seeking peace in the hills, a group chasing adventure, a couple planning a romantic escape, or a family looking for a relaxed holiday — we tailor experiences to match your vision, budget, and interests.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">What We Offer</h2>
        <ul className="about-list">
          <li>Group departures and customized private tours</li>
          <li>Backpacking trips and trekking experiences</li>
          <li>Scenic road trip itineraries</li>
          <li>Handpicked homestays and local experiences</li>
          <li>Real-time support and personalized trip planning</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">Why Choose Us</h2>
        <p>
          Our personalized approach and round-the-clock assistance set us apart. We collaborate with reliable local vendors, verified accommodations, and experienced drivers to ensure a safe and authentic journey.
        </p>
        <p>
          With over 9 years of experience, we’ve earned the trust of repeat travelers, enthusiastic referrals, and glowing testimonials. We’re committed to honest pricing, transparent communication, and building relationships — not just selling packages.
        </p>
      </section>

      <section className="founder-section">
        <h2 className="about-subtitle">Message from the Founder</h2>
        <blockquote>
          “At Desire4Travels, our mission is simple — to make your travel experience seamless, affordable, and truly memorable. We curate personalized trips that fit your interests, pace, and budget. Our team is committed to providing end-to-end support, from planning to execution, so you can focus on enjoying the journey. Every itinerary is crafted with care, local insights, and a personal touch. We’re not just building trips — we’re building experiences you’ll cherish.”
        </blockquote>
        <p className="founder-signature">— Ayush Agrawal, Founder</p>
      </section>
    </div>
  );
};

export default AboutUs;
