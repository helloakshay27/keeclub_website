import { HeartIcon, MapPinIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, onViewMap }) => {
  const navigate = useNavigate();

  const {
    name,
    location,
    startingPrice,
    configurations,
    imageUrl,
    projectId,
    id,
    project_id,
    mapUrl, // make sure this is passed
  } = property || {};

  const propertyId = projectId || id || project_id;

  const handleClick = () => {
    if (propertyId) {
      navigate(`/Project-Details/${propertyId}`);
    } else {
      console.error("No project ID available for navigation", property);
    }
  };

  return (
    <div className="mb-4 w-full">
      <div
        className="flex flex-col md:flex-row bg-[#F7F9FC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={e => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {/* Property Image */}
        <div className="w-full md:w-1/3 relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-52 sm:h-64 md:h-44 xl:h-44 2xl:h-52 3xl:h-56 object-cover object-center"
          />
          <div className="absolute top-4 left-4">
            <div>
              <div
                className="bg-red-500 flex mt-2 justify-between rounded-md"
                aria-label="Under Construction"
              >
                <svg
                  className="m-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18.774"
                  height="15.675"
                  viewBox="0 0 18.774 15.675"
                >
                  <path
                    d="M17.772,15.675H11.666a1.3,1.3,0,0,1-.547-.182.72.72,0,0,1-.548.182H4.465a1.016,1.016,0,0,1-1-1V11.984H1a1.016,1.016,0,0,1-1-1v-2.6a1.016,1.016,0,0,1,1-1h2.46V4.6H1a1.016,1.016,0,0,1-1-1V1A1.016,1.016,0,0,1,1,0H7.108a1.3,1.3,0,0,1,.547.182A.722.722,0,0,1,8.2,0h6.106a1.016,1.016,0,0,1,1,1V3.691h2.462a1.016,1.016,0,0,1,1,1v2.6a1.016,1.016,0,0,1-1,1H15.31v2.779h2.462a1.016,1.016,0,0,1,1,1v2.6A1.016,1.016,0,0,1,17.772,15.675Z"
                    fill="#fff"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="w-full md:w-[60%] px-4 flex flex-col justify-between">
          <div className="pl-0 md:pl-2 py-4 flex-1 flex flex-col justify-center">
            <h1 className="font-Poppins text-[#3E4B54] text-lg md:text-lg font-bold capitalize">
              {name}
            </h1>
            <p className="font-Montserrat text-sm md:text-[14px] text-[#838687] capitalize italic">
              {location}
            </p>

            <div className="font-Montserrat">
              <div className="w-full flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-4">
                <div>
                  <p className="text-xs md:text-[13px] uppercase tracking-wider font-Poppins text-[#838687]">
                    Starting
                  </p>
                  <h1 className="font-bold text-sm md:text-[16px]">
                    {startingPrice}
                  </h1>
                </div>

                <div>
                  <p className="text-xs md:text-[13px] uppercase tracking-wider text-[#838687]">
                    Configurations
                  </p>
                  <h1 className="font-bold text-sm md:text-[16px]">
                    {configurations}
                  </h1>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // to prevent navigation
                    if (onViewMap && typeof onViewMap === "function") {
                      onViewMap();
                    }
                  }}
                  className="text-[#F59E0B] text-sm underline cursor-pointer"
                >
                  View on map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
