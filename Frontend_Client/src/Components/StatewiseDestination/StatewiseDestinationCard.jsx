import './StatewiseDestinationCard.css';

const StatewiseDestinationCard = ({ imgSrc, statetitle, tagline }) => {
  return (
    <div className='statewisedestination-card'>
      <img src={imgSrc} alt={statetitle} className="statewisedestination-image" />
      <div className="card-content">
        <h2>{statetitle}</h2>
        <p>{tagline}</p>
        <button className="explore-btn">Explore More</button>
      </div>
    </div>
  );
};

export default StatewiseDestinationCard;
