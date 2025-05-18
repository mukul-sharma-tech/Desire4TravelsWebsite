import React from 'react';
import { Link } from 'react-router-dom';
import './TypeTrip.css';
import Mountain from '../assets/Mountain.png';
import Beach from '../assets/Beach.png';
import Religious from '../assets/Religious.png';
import Heritage from '../assets/Heritage.png';
import Offbeat from '../assets/Offbeat.png';
import Other from '../assets/Other.png';

const types = [
  { name: 'Mountain', image: Mountain },
  { name: 'Beach', image: Beach },
  { name: 'Religious', image: Religious },
  { name: 'Heritage', image: Heritage },
  { name: 'Offbeat', image: Offbeat },
  { name: 'Other', image: Other }
];

const TypeTrip = () => {
  return (
    <div className="typetrip">
      <h1>Type of Trips</h1>
      <div className="typetrip-box">
        {types.map((type) => (
          <Link
            to={`/triptype/${type.name}`}
            className="typetripcard"
            key={type.name}
          >
            <img src={type.image} alt={type.name} className="logo" />
            <p>{type.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TypeTrip;
