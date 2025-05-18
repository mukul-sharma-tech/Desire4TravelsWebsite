import React, { useEffect, useState } from "react";
import PackageCard from "../Components/Package/PackageCard";
import "./Package.css";

const Package = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/packages");
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="package-container">
    <div className="package-list">
      <h1>Our Packages</h1>
      <div className="package-grid">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id} 
              imgSrc={pkg.photo}
              packageName={pkg.packageName}
              destinations={pkg.destinations}
              price={pkg.price}
              duration={pkg.duration}
            />
          ))
        ) : (
          <p>No packages available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Package;
