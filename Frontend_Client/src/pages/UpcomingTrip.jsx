import React, { useEffect, useState } from "react";
import PackageCard from "../Components/Package/PackageCard";
import "./UpcomingTrip.css";

const UpcomingTrip = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/packages");
        const data = await res.json();
        const latestPackages = data.slice(0, 4);
        setPackages(latestPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="upcoming-trip">
      <h1><strong>Upcoming Trips</strong></h1>
      <div className="package-grid">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            id={pkg.id}
            imgSrc={pkg.photo}
            packageName={pkg.packageName}
            destinations={pkg.destinations}
            price={pkg.price}
            duration={pkg.duration}
          />
        ))}
      </div>
    </div>
  );
  
};

export default UpcomingTrip;
