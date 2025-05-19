import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import MapComponent from "./MapComponent";

const ProjectsList = () => {
  const [properties, setProperties] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://api-connect.panchshil.com/get_all_projects.json"
        );
        const data = await response.json();

        const featuredProjects = data.featured.map((project) => ({
          id: project.id,
          name: project.project_name,
          location: project?.location?.city || "",
          startingPrice: `₹${project.price} Cr`,
          configurations: project.configurations
            .map((cfg) => cfg.name)
            .join(", "),
          imageUrl: project.image_url,
          mapUrl: project.map_url,
        }));

        setProperties(featuredProjects);

        // Only include valid geolocation points
        setMapMarkers(
          featuredProjects.filter(p => p.latitude && p.longitude)
            .map(p => ({
              id: p.id,
              name: p.name,
              price: p.startingPrice,
              latitude: parseFloat(p.latitude),
              longitude: parseFloat(p.longitude),
            }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="mb-8">
      <p className="font-Montserrat mb-4">
        {properties.length} Projects listed here
      </p>

      {/* <MapComponent markers={mapMarkers} /> */}

      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto mt-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
