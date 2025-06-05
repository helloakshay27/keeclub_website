import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import useApiFetch from "../../hooks/useApiFetch";

const ProjectsList = () => {
  const { data, loading, error } = useApiFetch(
    "https://piramal-loyalty-dev.lockated.com/get_all_projects.json"
  );

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (data && data.featured) {
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
    }
  }, [data]);

  if (loading) return <p className="text-center py-8">Loading projects...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error loading projects: {error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 md:mt-6 lg:mt-8 px-4 sm:px-6 md:px-8">
      {/* Left Side: Property List */}
      <div className="flex flex-col">
        <p className="font-Montserrat text-base md:text-lg mb-4">
          {properties.length} Projects listed here
        </p>

        <div className="overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Right Side: Sticky Map (hidden on small screens) */}
      <div className="hidden lg:block h-[80vh] sticky top-24 rounded-xl overflow-hidden shadow-md">
        <iframe
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Piramal Revanta Sales Office&t=&z=13&ie=UTF8&iwloc=B&output=embed"
          title="Google Map"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ProjectsList;
