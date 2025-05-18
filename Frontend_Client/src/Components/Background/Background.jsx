import './Background.css';
import img1 from '../../assets/Back1.jpg';
import img2 from '../../assets/Back2.jpg';
import img3 from '../../assets/Back3.jpg';

const Background = ({ heroCount }) => {
  if (heroCount === 0) {
    return <img src={img1} className="background" />;
  }
  else if(heroCount===1)
  {
    return <img src={img2} className="background" />
  }
  else if(heroCount===2)
    {
      return <img src={img3} className="background" />
    }
  return null;
  
};

export default Background;
