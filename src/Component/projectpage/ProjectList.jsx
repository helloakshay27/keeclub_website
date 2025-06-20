import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import useApiFetch from "../../hooks/useApiFetch";
import BASE_URL from "../../Confi/baseurl"

const ProjectsList = ({ view = "list" }) => {
  const { data, loading, error } = useApiFetch(
    `${BASE_URL}get_all_projects.json`
  );

  const [properties, setProperties] = useState([]);
  const [selectedMapUrl, setSelectedMapUrl] = useState(
    "https://maps.google.com/maps?width=600&height=400&hl=en&q=Piramal Revanta Sales Office&t=&z=13&ie=UTF8&iwloc=B&output=embed"
  );

  useEffect(() => {
    if (data && data.featured) {
      const featuredProjects = data.projects.map((project) => ({
        id: project.id,
        name: project.project_name,
        location: project?.location?.city || "",
        startingPrice: `₹${project.price}`,
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

  // Both views: always show map on right (hidden on small screens)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 md:mt-6 lg:mt-8 px-4 sm:px-6 md:px-8">
      {/* Left Side: Property List or Grid */}
      <div className="flex flex-col">
        <p className="font-Montserrat text-base md:text-lg mb-4">
          {properties.length} Projects listed here
        </p>
        {view === "grid" ? (
          <div className="grid gap-x-10 pr-4 mb-5 h-[90vh] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200 overflow-y-scroll lg:grid-cols-2 gap-y-10 md:gap-y-4 z-10">
            {properties.map((property) => (
              <div key={property.id} className="z-10 bg-[#F2F5FC] drop-shadow-2xl w-full flex flex-col cursor-pointer rounded-xl">
                <div className="h-44 xl:h-44 2xl:h-52 3xl:h-56 w-full">
                  <div className="relative">
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      loading="lazy"
                      width="100%"
                      className="h-44 xl:h-44 2xl:h-52 3xl:h-56 rounded-xl object-cover object-center"
                    />
                    <div className="absolute top-1 left-3">
                      <div className="bg-red-500 flex mt-2 justify-between rounded-md" aria-label="Under Construction">
                        {/* Under Construction SVG */}
                        <svg className="m-2" id="Group_4" data-name="Group 4" xmlns="http://www.w3.org/2000/svg" width="18.774" height="15.675" viewBox="0 0 18.774 15.675">
                          <path id="Shape" d="M17.772,15.675H11.666a1.3,1.3,0,0,1-.547-.182.72.72,0,0,1-.548.182H4.465a1.016,1.016,0,0,1-1-1V11.984H1a1.016,1.016,0,0,1-1-1v-2.6a1.016,1.016,0,0,1,1-1h2.46V4.6H1a1.016,1.016,0,0,1-1-1V1A1.016,1.016,0,0,1,1,0H7.108a1.3,1.3,0,0,1,.547.182A.722.722,0,0,1,8.2,0h6.106a1.016,1.016,0,0,1,1,1V3.691h2.462a1.016,1.016,0,0,1,1,1v2.6a1.016,1.016,0,0,1-1,1H15.31v2.779h2.462a1.016,1.016,0,0,1,1,1v2.6A1.016,1.016,0,0,1,17.772,15.675ZM4.465,12.121a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.067.067,0,0,0,.062-.038.048.048,0,0,0-.016-.053v-2.6a.1.1,0,0,0-.091-.091H4.465Zm7.2-.046a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H11.666ZM1,8.385a.1.1,0,0,0-.091.091v2.6A.1.1,0,0,0,1,11.164H7.108a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H1Zm7.245-.046a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.092h6.06a.1.1,0,0,0,.091-.092V8.43a.1.1,0,0,0-.091-.091H8.248Zm3.418-3.691a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H11.666Zm-7.2,0a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.061a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H4.465ZM1,.911A.1.1,0,0,0,.911,1V3.6A.1.1,0,0,0,1,3.691H7.108A.1.1,0,0,0,7.2,3.6V1A.1.1,0,0,0,7.108.911ZM8.2.865A.066.066,0,0,0,8.141.9a.05.05,0,0,0,.016.056v2.6a.1.1,0,0,0,.091.091h6.06a.1.1,0,0,0,.091-.091V.957a.1.1,0,0,0-.091-.092Z" transform="translate(0 0)" fill="#fff"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
                  <div className="pl-2 flex-1 flex flex-col justify-center">
                    <div>
                      <h1 className="font-Poppins text-[#3E4B54] truncate text-lg font-bold capitalize mt-2">{property.name}</h1>
                      <p className="font-Montserrat text-[14px] text-[#838687] capitalize italic">{property.location}</p>
                    </div>
                    <div className="font-Montserrat">
                      <div className="w-full flex flex-row justify-between mt-4">
                        <div>
                          <p className="text-[13px] leading-4 uppercase tracking-wider font-Poppins text-[#838687]">Starting</p>
                          <h1 className="self-end font-bold md:text-[16px]">{property.startingPrice}</h1>
                        </div>
                        <div>
                          <p className="text-[13px] leading-4 uppercase tracking-wider text-[#838687]">Configurations</p>
                          <h1 className="self-end font-bold md:text-[16px]">{property.configurations}</h1>
                        </div>
                      </div>
                      <button className="hidden lg:block text-[#F59E0B] text-sm self-center text-right">
                        View on map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewMap={() => setSelectedMapUrl(property.mapUrl)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Sticky Map (hidden on small screens) */}
      <div className="hidden lg:block h-[80vh] sticky top-24 rounded-xl overflow-hidden shadow-md">
        <iframe
          src={selectedMapUrl}
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
