import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">

      <div className="manage-enquiries-card">
        <h1><Link to="/adminenquiries" className="link">Manage Enquiries</Link></h1>
      </div>

      <div className="manage-newsletter-card">
        <h1><Link to="/newsletteradmin" className="link">Manage Newsletter</Link></h1>
      </div>
      
      <div className="manage-destination-card">
        <h1><Link to="/managedestination" className="link">Manage Destinations</Link></h1>
      </div>

      <div className="manage-package-card">
        <h1><Link to="/managepackage" className="link">Manage Packages</Link></h1>
      </div>

      <div className="manage-blog-card">
        <h1><Link to="/manageblog" className="link">Manage Blogs</Link></h1>
      </div>

    </div>

    
  );
};

export default Home;
