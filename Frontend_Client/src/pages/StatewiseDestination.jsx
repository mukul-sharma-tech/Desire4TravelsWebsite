import './StatewiseDestination.css';
import StatewiseDestinationCard from '../Components/StatewiseDestination/StatewiseDestinationCard';
import tajmahal from '../assets/tajmahal.jpg';

const StatewiseDestination = () => {
  return (
    <div className='StatewiseDestination'>
     <div className='StatewiseDestination-box'>
      <h1>Destination by State</h1>
      <div className='cards-container'>
        <StatewiseDestinationCard 
          imgSrc={tajmahal} 
          statetitle="Uttar Pradesh" 
          tagline="Home of the Taj"  
        />                 
      </div>
      </div>
    </div>
  );
};

export default StatewiseDestination;
