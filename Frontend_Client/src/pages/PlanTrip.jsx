import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PlanTrip.css';

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    noofdays: '',
    travelers: '',
    preference: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Trip Planned:', formData);
    // Send to API or process
  };

  return (
    <div className="trip-container">
      <div className="trip-box">
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />

          <DatePicker
            selected={formData.startDate}
            onChange={handleDateChange}
            placeholderText="Travel Date"
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker"
            required
          />

          <input
            type="number"
            name="noofdays"
            placeholder="Number of Days"
            value={formData.noofdays}
            onChange={handleChange}
            min="1"
            required
          />

          <input
            type="number"
            name="travelers"
            placeholder="Number of Travelers"
            min="1"
            value={formData.travelers}
            onChange={handleChange}
            required
          />

          <select
            name="preference"
            value={formData.preference}
            onChange={handleChange}
            required
          >
            <option value="">Type of Group</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="couples">Couples</option>
            <option value="solo">Solo</option>
            <option value="other">Other</option>
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;
