import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: 18.5204, // Pune coordinates
  lng: 73.8567
};

const MapComponent = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("https://api-connect.panchshil.com/get_all_projects.json");
        setProjects(response.data.featured); // Make sure it's `featured`, not whole response
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <LoadScript googleMapsApiKey="UNE7QFnkjxZJgtKm-Od6EaNeBsWOAiGGp8RpXpWrYQY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {projects && projects.map((project, index) => {
          const { location, project_name, price } = project;
          
          // Make sure coordinates exist; otherwise, skip marker
          if (!location || !location.latitude || !location.longitude) return null;

          return (
            <Marker
              key={index}
              position={{
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude)
              }}
              label={{
                text: `${project_name}\n${price}`,
                className: "map-label"
              }}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
