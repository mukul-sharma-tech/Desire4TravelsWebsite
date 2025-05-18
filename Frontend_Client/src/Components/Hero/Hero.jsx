import './Hero.css';
import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Background from '../Background/Background.jsx';

const Hero = ({ heroData, setHeroCount, heroCount, planTripRef }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    travelers: '',
    travelDate: ''
  });

  useEffect(() => {
    flatpickr("#travel-date", {
      dateFormat: "d/m/Y",
      minDate: "today",
      onChange: (selectedDates, dateStr) => {
        setFormData(prev => ({ ...prev, travelDate: dateStr }));
      }
    });
  }, []);

  const handleScroll = () => {
    if (planTripRef?.current) {
      planTripRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e) => {
    const { placeholder, value } = e.target;

    const map = {
      "Name": "name",
      "Phone": "phone",
      "Where to?": "destination",
      "No. of Travelers": "travelers"
    };

    const key = map[placeholder];
    if (key) {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Form submitted successfully!');
        setFormData({ name: '', phone: '', destination: '', travelers: '', travelDate: '' });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to submit form');
    }
  };

  return (
   <div className="hero-section"> {/* Add wrapper */}
      <div className="background">
         <Background heroCount={heroCount} />
      </div>

      <div className='hero'>
        <div className="hero-left">
          <div className="hero-text">
            <p className='p2'>{heroData.text1}</p>
            <p className='p1'>{heroData.text2}</p>
          </div>

          <div className="hero-explore">
            <p><button onClick={handleScroll} className="arrow-link hero-explore-btn">Plan Your Trip</button></p>
          </div>

          <div className="hero-dot-play">
            <ul className="hero-dots">
              <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}></li>
              <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}></li>
              <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}></li>
            </ul>
          </div>
        </div>

        <div className='enquiry-container'>
          <form className='enquiry-form' onSubmit={handleSubmit}>
            <h2>Connect with one of our travel experts.</h2>
            <input type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]*" inputMode="numeric" />
            <input type="text" placeholder="Where to?" value={formData.destination} onChange={handleChange} />
            <input type="number" placeholder="No. of Travelers" min="1" value={formData.travelers} onChange={handleChange} />
            <input type="text" id="travel-date" placeholder="Travel Date" value={formData.travelDate} readOnly />
            <button type="submit" className='enquiry-btn'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
