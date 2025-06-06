import React, { useState } from "react";
import { Search } from "lucide-react";
import Card1 from "../assets/Hotel/Card1.png";
import Card2 from "../assets/Hotel/Card2.png";
import Card3 from "../assets/Hotel/Card3.png";
import Image1 from "../assets/Hotel/Image1.png";
import Image2 from "../assets/Hotel/Image2.png";
import Image3 from "../assets/Hotel/Image3.png";
import { Link } from "react-router-dom";

// Hotel images
const popularHotels = [Card1, Card2, Card3, Card1, Card2]
const weekendHotels = [Image1, Image2, Image3, Image1, Image3];

// HotelCard component
const HotelCard = ({ img }) => (
  <Link
    to="/dashboard/hotel-details"
    className="w-[90%] sm:w-[300px] md:min-w-[400px] flex-shrink-0 mr-4 scroll-snap-align-start"
  >
    <div>
      <img
        src={img}
        alt="hotel"
        className="w-full h-48 sm:h-56 md:h-60 rounded-md object-cover"
      />
      <div className="mt-2 font-semibold text-base sm:text-lg">Hotel Royal</div>
      <div className="text-sm text-gray-600">₹10,000 for 4 nights</div>
    </div>
  </Link>
);

// Scrollable section
const ScrollSection = ({ title, hotels }) => (
  <div className="my-6 sm:my-8 px-2 sm:px-0">
    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{title}</h2>
    <div className="flex overflow-x-auto no-scrollbar scroll-snap-x-mandatory pr-4">
      {hotels.map((img, idx) => (
        <HotelCard key={idx} img={img} />
      ))}
    </div>
  </div>
);

const HotelList = () => {
  const [formData, setFormData] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching with:", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg my-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Where */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Where</div>
          <input
            type="text"
            value={formData.where}
            onChange={(e) => handleChange("where", e.target.value)}
            placeholder="Search destinations"
            className="w-full text-sm font-medium bg-transparent outline-none  pb-1"
          />
        </div>

        {/* Check-in */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Check in</div>
          <input
            type="date"
            value={formData.checkIn}
            onChange={(e) => handleChange("checkIn", e.target.value)}
            className=" text-sm font-medium bg-transparent outline-none pb-1"
          />
        </div>

        {/* Check-out */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Check out</div>
          <input
            type="date"
            value={formData.checkOut}
            onChange={(e) => handleChange("checkOut", e.target.value)}
            className=" text-sm font-medium bg-transparent outline-none  pb-1"
          />
        </div>

        {/* Guests */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Who</div>
          <input
            type="text"
            value={formData.guests}
            onChange={(e) => handleChange("guests", e.target.value)}
            placeholder="Add guests"
            className="w-full text-sm font-medium bg-transparent outline-none  pb-1"
          />
        </div>

        {/* Search Button */}
        <button
          className="bg-gray-800 p-3 rounded-full text-white self-end md:self-auto"
          onClick={handleSearch}
        >
          <Search size={22} />
        </button>
      </div>

      {/* Sections */}
      <ScrollSection title="Popular Hotels" hotels={popularHotels} />
      <ScrollSection title="Available this weekend" hotels={weekendHotels} />
    </div>
  );
};

export default HotelList;
