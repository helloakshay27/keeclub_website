import React, { useState } from "react";
import { Search } from "lucide-react";
import card1 from "../assets/Hotel/Card1.png";
import card2 from "../assets/Hotel/Card2.png";
import card3 from "../assets/Hotel/Card3.png";
import Image1 from "../assets/Hotel/Image1.png";
import Image2 from "../assets/Hotel/Image2.png";
import Image3 from "../assets/Hotel/Image3.png";
import { Link } from "react-router-dom";

// Separate arrays for each section
const popularHotels = [card1, card2, card3, card1, card2];
const weekendHotels = [Image1, Image2, Image3, Image1, Image3];

// HotelCard component
const HotelCard = ({ img }) => (
    <Link to="/dashboard/hotel-details" className="min-w-[400px] flex-shrink-0 mr-4">
        <div>
            <img
                src={img}
                alt="hotel"
                className="w-full h-50 rounded-md object-cover"
            />
            <div className="mt-2 font-semibold">Hotel Royal</div>
            <div className="text-sm text-gray-600">₹10,000 for 4 nights</div>
        </div>
    </Link>
);

// ScrollSection component
const ScrollSection = ({ title, hotels }) => (
    <div className="my-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex overflow-x-auto no-scrollbar pr-4">
            {hotels.map((img, idx) => (
                <HotelCard key={idx} img={img} />
            ))}
        </div>
    </div>
);

// Main component
const HotelList = () => {
    const [formData, setFormData] = useState({
        where: "",
        checkIn: "",
        checkOut: "",
        guests: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearch = () => {
        console.log("Searching with:", formData);
        // You can navigate or filter here
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Search Bar */}
            <div className="w-full max-w-4xl mx-auto flex items-center bg-white p-3 rounded-lg shadow-lg my-6">
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Where</div>
                    <input
                        type="text"
                        value={formData.where}
                        onChange={(e) => handleChange("where", e.target.value)}
                        placeholder="Search destinations"
                        className="w-full text-sm font-medium bg-transparent outline-none"
                    />
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Check in</div>
                    <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleChange("checkIn", e.target.value)}
                        className="w-full text-sm font-medium bg-transparent outline-none"
                    />
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Check out</div>
                    <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => handleChange("checkOut", e.target.value)}
                        className="w-full text-sm font-medium bg-transparent outline-none"
                    />
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Who</div>
                    <input
                        type="text"
                        value={formData.guests}
                        onChange={(e) => handleChange("guests", e.target.value)}
                        placeholder="Add guests"
                        className="w-full text-sm font-medium bg-transparent outline-none"
                    />
                </div>
                <button
                    className="bg-gray-800 p-3 rounded-full text-white ml-2"
                    onClick={handleSearch}
                >
                    <Search size={22} />
                </button>
            </div>

            {/* Sections with separate image data */}
            <ScrollSection title="Popular Hotels" hotels={popularHotels} />
            <ScrollSection title="Available this weekend" hotels={weekendHotels} />
        </div>
    );
};

export default HotelList;


// CSS to hide scrollbar (already included in your code, kept for completeness)
const styles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Add the styles to the document (optional if already in your project)
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);