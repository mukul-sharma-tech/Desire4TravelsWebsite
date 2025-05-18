import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DestinationCard from '../Components/Destination/DestinationCard';
import './TripTypePage.css';

const TripTypePage = () => {
  const { type } = useParams();
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch destinations');
        return res.json();
      })
      .then(data => {
        const normalizedType = type.toLowerCase();
        const filtered = data.destinations.filter(dest => {
          if (Array.isArray(dest.type)) {
            return dest.type.some(t => t.toLowerCase() === normalizedType);
          }
          return dest.type?.toLowerCase() === normalizedType;
        });
        setDestinations(filtered);
      })
      .catch(err => {
        console.error(err);
      });
  }, [type]);

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="trip-type-page">
      <h1 style={{ fontSize: '2rem', color: 'black', textAlign: 'center', marginBottom: '30px', marginTop: '75px' }}>
        Explore Destinations of {capitalizedType}
      </h1>

      <div className="cards-container">
        {destinations.length > 0 ? (
          destinations.map(dest => (
            <DestinationCard
              key={dest.id}
              imgSrc={`http://localhost:3000/uploads/${dest.image}`}
              title={dest.name}
              location={dest.state}
              tripType={dest.type}
              rating={parseFloat(dest.rating || 0).toFixed(1)}
              onClick={() => navigate(`/destination/${dest.id}`)}
            />
          ))
        ) : (
          <p>No destinations found for this type.</p>
        )}
      </div>
    </div>
  );
};

export default TripTypePage;
