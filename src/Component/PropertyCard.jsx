import { HeartIcon, MapPinIcon } from "lucide-react";
import React from "react";
// import { MapPinIcon, HeartIcon } from '@heroicons/react/24/solid';

const PropertyCard = ({ property }) => {
  const { name, location, startingPrice, configurations, imageUrl } = property;

  return (
    <div className="mb-4 w-full  ">
      <div className="flex bg-[#F7F9FC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
        {/* Property Image */}
        <div className="md:w-1/3 relative">
          <img
            src={imageUrl}
            alt={name}
            class="h-44 xl:h-44 2xl:h-52 3xl:h-56 rounded-xl  object-cover object-center"
          />
          <div className="absolute top-4 left-4">
            <div className="">
              <div
                class="bg-red-500  flex mt-2 justify-between rounded-md"
                aria-label="Under Construction"
              >
                <svg
                  class="m-2 "
                  id="Group_4"
                  data-name="Group 4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18.774"
                  height="15.675"
                  viewBox="0 0 18.774 15.675"
                >
                  <path
                    id="Shape"
                    d="M17.772,15.675H11.666a1.3,1.3,0,0,1-.547-.182.72.72,0,0,1-.548.182H4.465a1.016,1.016,0,0,1-1-1V11.984H1a1.016,1.016,0,0,1-1-1v-2.6a1.016,1.016,0,0,1,1-1h2.46V4.6H1a1.016,1.016,0,0,1-1-1V1A1.016,1.016,0,0,1,1,0H7.108a1.3,1.3,0,0,1,.547.182A.722.722,0,0,1,8.2,0h6.106a1.016,1.016,0,0,1,1,1V3.691h2.462a1.016,1.016,0,0,1,1,1v2.6a1.016,1.016,0,0,1-1,1H15.31v2.779h2.462a1.016,1.016,0,0,1,1,1v2.6A1.016,1.016,0,0,1,17.772,15.675ZM4.465,12.121a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.067.067,0,0,0,.062-.038.048.048,0,0,0-.016-.053v-2.6a.1.1,0,0,0-.091-.091H4.465Zm7.2-.046a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H11.666ZM1,8.385a.1.1,0,0,0-.091.091v2.6A.1.1,0,0,0,1,11.164H7.108a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H1Zm7.245-.046a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.092h6.06a.1.1,0,0,0,.091-.092V8.43a.1.1,0,0,0-.091-.091H8.248Zm3.418-3.691a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.106a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H11.666Zm-7.2,0a.1.1,0,0,0-.091.091v2.6a.1.1,0,0,0,.091.091h6.061a.1.1,0,0,0,.091-.091v-2.6a.1.1,0,0,0-.091-.091H4.465ZM1,.911A.1.1,0,0,0,.911,1V3.6A.1.1,0,0,0,1,3.691H7.108A.1.1,0,0,0,7.2,3.6V1A.1.1,0,0,0,7.108.911ZM8.2.865A.066.066,0,0,0,8.141.9a.05.05,0,0,0,.016.056v2.6a.1.1,0,0,0,.091.091h6.06a.1.1,0,0,0,.091-.091V.957a.1.1,0,0,0-.091-.092Z"
                    transform="translate(0 0)"
                    fill="#fff"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div class=" w-[60%] px-4 flex flex-col justify-between scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
          <div class=" pl-2 flex-1 flex flex-col justify-center">
            <h1 class="font-Poppins text-[#3E4B54] truncate text-lg font-bold capitalize mt-2">
              {name}
            </h1>
            <p class="font-Montserrat text-[14px] text-[#838687] capitalize italic">
              {location}
            </p>

            <div class="font-Montserrat">
              <div class=" w-[60%] lg:w-full xl:w-[80%] flex flex-row justify-between mt-4">
                <div>
                  <p class="text-[13px] leading-4 uppercase tracking-wider font-Poppins text-[#838687]">
                    Starting
                  </p>
                  <h1 class=" self-end font-bold md:text-[16px]">
                    {startingPrice}
                  </h1>
                </div>

                <div>
                  <p class="text-[13px] leading-4 uppercase tracking-wider text-[#838687]">
                    Configurations
                  </p>
                  <h1 class=" self-end font-bold  md:text-[16px]">
                    {configurations}
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  class="hidden lg:block text-[#F59E0B] falsetext-sm self-center text-right"
                >
                  View on map
                </button>

                {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition duration-200">
              View Details
            </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
