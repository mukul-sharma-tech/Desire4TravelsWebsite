import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Hero from "./Components/Hero/Hero.jsx";
import Destination from "./pages/Destination.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import PlanTrip from "./pages/PlanTrip.jsx";
import StatewiseDestination from "./pages/StatewiseDestination.jsx";
import TypeTrip from "./pages/TypeTrip.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import Package from "./pages/Package.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import AboutUs from './pages/Aboutus.jsx';
import Contact from './pages/Contact.jsx';
import UpcomingTrip from './pages/UpcomingTrip.jsx';
import Review from './pages/Review.jsx';
import CareerPage from './pages/CareerPage.jsx';
import Popup from './pages/PopUp.jsx';
import Faq from './pages/Faq.jsx';
import TripTypePage from './pages/TripTypePage.jsx';
import Tawk from './Components/Tawk/Tawk.jsx';

import BlogPost from './pages/blogs/BlogPost.jsx';
import BlogList from './pages/blogs/BlogList.jsx';



import "./App.css";

const App = () => {
  const heroData = [
    {
      text1: "Manali, Himachal Pradesh",
      text2:
        "Manali is a breathtaking destination offering thrilling skiing, paragliding, and trekking adventures, along with stunning natural beauty, and snow-capped mountains.",
    },
    {
      text1: "Munnar, Kerala",
      text2:
        "Munnar, a picturesque hill station in Kerala, offers tea plantations, misty mountains, wildlife, and serene landscapes for a peaceful escape.",
    },
    {
      text1: "Rishikesh, Uttarakhand",
      text2:
        "Rishikesh, the Yoga Capital of the World, offers serene ashrams, yoga retreats, and adventure sports like rafting, set along the Ganges River.",
    },
  ];

  const [heroCount, setHeroCount] = useState(0);
  const planTripRef = useRef(null);
  const location = useLocation();

  const [isPopupVisible, setIsPopupVisible] = useState(true);

  useEffect(() => {
    setIsPopupVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count === heroData.length - 1 ? 0 : count + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [heroData.length]);

  const excludedPaths = ["/login", "/signup"];
  const blurClass = isPopupVisible ? "blurred" : "";

  return (
    <div className="app-container">
      {!excludedPaths.includes(location.pathname) && isPopupVisible && (
        <Popup onClose={() => setIsPopupVisible(false)} />
      )}

      <Navbar />
      <div className={`app-content ${blurClass}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  heroData={heroData[heroCount]}
                  heroCount={heroCount}
                  setHeroCount={setHeroCount}
                  planTripRef={planTripRef}
                />
                <StatewiseDestination />
                <UpcomingTrip />
                <TypeTrip />
                <Review />
                <div ref={planTripRef}>
                  <PlanTrip />
                </div>
              </>
            }
          />
          <Route path="/destination" element={<Destination />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plantrip" element={<PlanTrip />} />
          {/* <Route path="/blogs" element={<BlogPage />} /> */}
          <Route path="/package" element={<Package />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careerpage" element={<CareerPage />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/triptype/:type" element={<TripTypePage />} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          {/* <Route path="/blogs/:slug/:id" element={<BlogPost />} /> */}
          <Route path="/blogs" element={<BlogList />} />

        </Routes>
      </div>
      <Tawk />
      <Footer />

    </div>
  );
};

export default App;
