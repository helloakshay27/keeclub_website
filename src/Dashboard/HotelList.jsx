import React from "react";
import { Search } from "lucide-react";
import card1 from "../assets/Hotel/Card1.png"; // Placeholder image for hotel cards
import card2 from "../assets/Hotel/Card2.png"; // Placeholder image for hotel cards
import card3 from "../assets/Hotel/Card3.png"; // Placeholder image for hotel cards


// Array of placeholder hotel images from Unsplash
const hotels = [
    card1,
    card2,
    card3,
    card1,
    card2,
    card3,

];

// HotelCard component for individual hotel cards
const HotelCard = ({ img }) => (
    <div className="min-w-[400px] flex-shrink-0 mr-4">
        <img
            src={img}
            alt="hotel"
            className="w-full h-50 rounded-md object-cover"
        />
        <div className="mt-2 font-semibold">Hotel Royal</div>
        <div className="text-sm text-gray-600">₹10,000 for 4 nights</div>
    </div>
);

// ScrollSection component for each scrollable section
const ScrollSection = ({ title }) => (
    <div className="my-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex overflow-x-auto no-scrollbar pr-4">
            {hotels.map((img, idx) => (
                <HotelCard key={idx} img={img} />
            ))}
        </div>
    </div>
);

// Main HotelList component
const HotelList = () => {

    return (
        <div className="max-w-7xl mx-auto px-4">

            {/* Search Bar */}
            <div className="w-full max-w-4xl mx-auto flex items-center bg-white p-3 rounded-lg shadow-lg my-6">
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Where</div>
                    <div className="font-medium text-sm">Search destinations</div>
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Check in</div>
                    <div className="font-medium text-sm">Add dates</div>
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Check out</div>
                    <div className="font-medium text-sm">Add dates</div>
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500">Who</div>
                    <div className="font-medium text-sm">Add guests</div>
                </div>
                <button className="bg-gray-800 p-3 rounded-full text-white ml-2">
                    <Search size={25} />
                </button>
            </div>

            {/* Hotel Sections */}
            <ScrollSection title="Popular Hotels" />
            <ScrollSection title="Available this weekend" />
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