import { Link } from "react-router-dom";
import useApiFetch from "../hooks/useApiFetch";
import { useEffect, useRef, useState } from "react";

const Event = () => {
    const { data } = useApiFetch('https://piramal-loyalty-dev.lockated.com/events.json');
    const categories = ["Entertainment", "Lifestyle"];
    const [selectedCategory, setSelectedCategory] = useState("Entertainment");
    const highlightRef = useRef(null);
    const labelRefs = useRef({});

    useEffect(() => {
        const currentLabel = labelRefs.current[selectedCategory];
        const highlight = highlightRef.current;

        if (currentLabel && highlight) {
            const rect = currentLabel.getBoundingClientRect();
            const containerRect = currentLabel.parentElement.getBoundingClientRect();

            const offset = 4; // matches Tailwind 'left-1' or 'px-1' padding (4px)
            highlight.style.width = `${rect.width}px`;
            highlight.style.transform = `translateX(${rect.left - containerRect.left - offset}px)`;
        }
    }, [selectedCategory]);

    const events = data?.events || [];

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
        return `${day} ${month}${year}`;
    };

    return (
        <div className="w-full">
            {/* Banner */}
            <div
                className="w-full h-[40vh] sm:h-[60vh] md:h-screen bg-center bg-cover"
                style={{
                    backgroundImage: `url('https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1718107491641_1718107491065_KeeClub03primalevent.jpg')`
                }}
            ></div>

            {/* Events Section */}
            <div className="px-4 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">Past Events</h2>
                <hr className="border-t-2 border-orange-600 w-[200px] mx-auto mb-6" />
                <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-extralight">
                    BROWSE EVENT CATEGORIES
                </p>

                {/* Category Toggle */}
                <div className="flex justify-center mt-10 mb-12">
                    <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex px-1 py-2 w-[320px] sm:w-[500px]">
                        <div
                            ref={highlightRef}
                            className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
                        ></div>

                        {categories.map((category) => (
                            <label
                                key={category}
                                ref={(el) => (labelRefs.current[category] = el)}
                                className={`relative z-10 cursor-pointer flex-1 text-center py-2 text-sm sm:text-base rounded-full font-normal transition-colors duration-300 ${selectedCategory === category ? "text-white" : "text-black"}`}
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={() => setSelectedCategory(category)}
                                    className="sr-only"
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Event Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <Link to={`/event/${event.id}`} key={index}>
                            <div className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500">
                                {/* Date Badge */}
                                <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm font-semibold z-10 rounded-bl-lg">
                                    <div className="text-base sm:text-lg font-bold leading-tight">
                                        {formatDate(event.from_time).split(' ')[0]}
                                    </div>
                                    <div className="text-xs">{formatDate(event.from_time).split(' ')[1]}</div>
                                </div>

                                {/* Event Image */}
                                <img
                                    src={event.attachfile?.document_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={event.event_name}
                                    className="w-full h-52 sm:h-64 object-cover"
                                />

                                {/* Event Info */}
                                <div className="p-3 sm:p-4 bg-white">
                                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{event.event_name}</h3>
                                    <p className="text-sm sm:text-base text-gray-700">{event.project_name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Event;
