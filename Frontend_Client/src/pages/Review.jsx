import React, { useState, useEffect, useRef } from 'react';
import './Review.css';

const Review = () => {
  const reviews = [
    {
      id: 1,
      text: "Desire4Travels made our Himachal trip absolutely seamless – from stays to sightseeing, everything was perfectly arranged!",
      author: "Rahul Sharma",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      text: "Had the best time in Goa with my friends, all thanks to Desire4Travels for curating such a fun and hassle-free itinerary!",
      author: "Priya Patel",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      text: "Professional, friendly, and super responsive – our Kerala getaway couldn't have been better planned!",
      author: "Anjali Gupta",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      text: "From the first call to the final day of the trip, Desire4Travels took care of every detail. Highly recommended!",
      author: "Vikram Singh",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 5,
      text: "Incredible service and thoughtful planning – they turned our group trip into an unforgettable experience!",
      author: "Neha Kapoor",
      image: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);

  // Auto-rotate reviews
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  const goToNext = () => {
    setTransition(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setTransition(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToReview = (index) => {
    setTransition(true);
    setCurrentIndex(index);
  };

  return (
    <div className="review-carousel-container">
      <h2 className="section-title">What Our Travelers Say</h2>
      <div className="review-carousel">
        <button className="carousel-button prev" onClick={goToPrev}>&#10094;</button>
        
        <div className="reviews-wrapper">
          {reviews.map((review, index) => (
            <div 
                  key={review.id}
                  className={`review-card ${index === currentIndex ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${(index - currentIndex) * 100}%) translateX(-50%)`,
                    transition: transition ? 'transform 0.5s ease-in-out' : 'none',
                    left: '50%'
                  }}
            >
              <div className="review-content">
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <img 
                    src={review.image} 
                    alt={review.author} 
                    className="author-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />
                  <span className="author-name">{review.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-button next" onClick={goToNext}>&#10095;</button>
      </div>
      
      <div className="carousel-indicators">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToReview(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Review;