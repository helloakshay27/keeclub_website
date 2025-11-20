import { Link } from "react-router-dom";
import useApiFetch from "../hooks/useApiFetch";
import { useEffect, useRef, useState } from "react";
import event_image from "../assets/main_event.jpg";
import BASE_URL from "../Confi/baseurl";

const Event = () => {
    const { data } = useApiFetch(`${BASE_URL}events.json`);
    const categories = ["Entertainment", "Lifestyle"];
    // Use array for multiple selected categories
    const [selectedCategories, setSelectedCategories] = useState(categories);
    
    // Add event type tab state
    const [selectedEventTab, setSelectedEventTab] = useState("past");
    const eventTabs = [
        // { key: "upcoming", label: "Upcoming Events" },
        { key: "past", label: "Past Events" }
    ];

    const highlightRef = useRef(null);
    const labelRefs = useRef({});
    const eventTabHighlightRef = useRef(null);
    const eventTabLabelRefs = useRef({});

    useEffect(() => {
        const currentLabel = labelRefs.current[selectedCategories[0]];
        const highlight = highlightRef.current;
        if (!currentLabel || !highlight) return;

        const setHighlight = () => {
            const rect = currentLabel.getBoundingClientRect();
            const containerRect = currentLabel.parentElement.getBoundingClientRect();
            const offset = 4;
            highlight.style.width = `${rect.width}px`;
            highlight.style.transform = `translateX(${rect.left - containerRect.left - offset}px)`;
        };

        const raf = requestAnimationFrame(() => {
            setTimeout(setHighlight, 50);
        });

        const resizeObserver = new ResizeObserver(() => {
            setHighlight();
        });

        resizeObserver.observe(currentLabel);

        return () => {
            cancelAnimationFrame(raf);
            resizeObserver.disconnect();
        };
    }, [selectedCategories]);

    // Effect for event tab highlighting
    useEffect(() => {
        const currentEventTabLabel = eventTabLabelRefs.current[selectedEventTab];
        const eventTabHighlight = eventTabHighlightRef.current;
        if (!currentEventTabLabel || !eventTabHighlight) return;

        const setEventTabHighlight = () => {
            const rect = currentEventTabLabel.getBoundingClientRect();
            const containerRect = currentEventTabLabel.parentElement.getBoundingClientRect();
            const offset = 4;
            eventTabHighlight.style.width = `${rect.width}px`;
            eventTabHighlight.style.transform = `translateX(${rect.left - containerRect.left - offset}px)`;
        };

        const raf = requestAnimationFrame(() => {
            setTimeout(setEventTabHighlight, 50);
        });

        const resizeObserver = new ResizeObserver(() => {
            setEventTabHighlight();
        });

        resizeObserver.observe(currentEventTabLabel);

        return () => {
            cancelAnimationFrame(raf);
            resizeObserver.disconnect();
        };
    }, [selectedEventTab]);

    // Get upcoming and past events from the data
    // const upcomingEvents = data?.upcomming_events || [];
    const pastEvents = data?.past_events || [];
    
    // Determine which events to show based on selected tab
    const currentEvents = pastEvents; // selectedEventTab === "upcoming" ? upcomingEvents : pastEvents

    // Filter events: if none selected, show all; else filter by event_type
    const filteredEvents =
        selectedCategories.length === 0
            ? currentEvents
            : currentEvents.filter(
                  (event) =>
                      event.event_type &&
                      selectedCategories.some(
                          (cat) => event.event_type.toLowerCase() === cat.toLowerCase()
                      )
              );

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString("default", { month: "short" });
        const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
        return `${day} ${month}${year}`;
    };

    // Get tab index for highlighting
    const getEventTabIndex = (key) => eventTabs.findIndex((tab) => tab.key === key);

    // Checkbox handler
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="w-full">
            {/* Header with Background Image */}
            <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-screen">
                <div
                    className="w-full h-[98%] bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(90deg, rgba(18, 44, 59, 0.5), rgba(255, 71, 19, 0.3)), url(${event_image})`,
                        backgroundPosition: "0% 0%, center center",
                        backgroundRepeat: "repeat, no-repeat",
                        backgroundAttachment: "scroll, scroll",
                        backgroundSize: "cover",
                        backgroundOrigin: "padding-box, padding-box",
                        backgroundClip: "border-box, border-box",
                    }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide text-center px-2">
                        Events Archive
                    </h1>
                </div>
            </div>

            {/* Events Section */}
            <div className="py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
                {/* Event Type Tabs */}
                {/* <div className="flex justify-center mb-8">
                    <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex p-2 w-full max-w-md">
                        <div
                            ref={eventTabHighlightRef}
                            className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
                            style={{
                                width: `${100 / eventTabs.length}%`,
                                transform: `translateX(${getEventTabIndex(selectedEventTab) * 100}%)`,
                            }}
                        ></div>
                        {eventTabs.map((tab) => (
                            <button
                                key={tab.key}
                                ref={(el) => (eventTabLabelRefs.current[tab.key] = el)}
                                onClick={() => setSelectedEventTab(tab.key)}
                                className={`relative z-10 cursor-pointer flex-1 py-2 text-sm sm:text-base rounded-full font-normal transition-colors duration-300 ${
                                    selectedEventTab === tab.key ? "text-white" : "text-black"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div> */}

                <h2 className="text-center text-xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">
                    Past Events
                </h2>
                <hr className="border-t-2 border-orange-600 w-[200px] mx-auto mb-6" />
                <p className="text-center text-sm sm:text-lg md:text-xl lg:text-2xl font-extralight">
                    BROWSE EVENT CATEGORIES
                </p>

                {/* Category Toggle */}
                <div className="flex flex-wrap gap-x-2 lg:gap-x-4 gap-y-2 mx-auto items-start lg:items-center justify-center pt-6 w-[80%] md:w-[70%] mb-5">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                name="category"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="z-10 self-center mx-2 bg-white rounded-md border-gray-300 checked:bg-primary"
                                autoComplete="off"
                                style={{
                                    width: "1.5rem",
                                    height: "1.5rem",
                                    minWidth: "1.5rem",
                                    minHeight: "1.5rem",
                                }}
                            />
                            <p className="text-black uppercase font-Montserrat text-xl">{category}</p>
                        </div>
                    ))}
                </div>

                {/* Event Cards */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    {console.log("filteredEvents:-",filteredEvents)
                    }
                    {/* Event Cards Grid */}
                    {filteredEvents.length === 0 ? (
                        <div className="w-full text-center py-16 text-gray-500 text-lg font-semibold">
                            No past events to show for the selected category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredEvents.map((event, index) => {
                                // Get fallback image from any event_images_* array
                                let fallbackImg = null;
                                const imgSources = [
                                    event.event_images_1_by_1,
                                    event.event_images_9_by_16,
                                    event.event_images_3_by_2,
                                    event.event_images_16_by_9
                                ];
                                for (const arr of imgSources) {
                                    if (Array.isArray(arr) && arr.length > 0 && arr[0].document_url) {
                                        fallbackImg = arr[0].document_url;
                                        break;
                                    }
                                }
                                const imgUrl =
                                    event.attachfile?.document_url ||
                                    fallbackImg ||
                                    "https://via.placeholder.com/400x300?text=No+Image";
                                return (
                                    <Link to={`/event/${event.id}`} key={index}>
                                        <div className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500 w-full h-80 flex flex-col">
                                            {/* Date Badge */}
                                            <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold z-10 rounded-bl-lg">
                                                <div className="text-sm sm:text-base font-bold leading-tight">
                                                    {formatDate(event.from_time).split(" ")[0]}
                                                </div>
                                                <div className="text-xs sm:text-sm">{formatDate(event.from_time).split(" ")[1]}</div>
                                            </div>

                                            {/* Event Image */}
                                            <img
                                                src={imgUrl}
                                                alt={event.event_name}
                                                className="w-full h-44 sm:h-48 object-cover"
                                                loading="lazy"
                                            />

                                            {/* Event Info */}
                                            <div className="p-3 sm:p-4 bg-white flex-grow">
                                                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">{event.event_name}</h3>
                                                <p className="text-xs sm:text-sm md:text-base text-gray-700">{event.project_name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Event;