// import { Link } from "react-router-dom";
// import useApiFetch from "../hooks/useApiFetch";
// import { useEffect, useRef, useState } from "react";
// import event_image from "../assets/main_event.jpg";

// const Event = () => {
//     const { data } = useApiFetch("https://piramal-loyalty-dev.lockated.com/events.json");
//     const categories = ["Entertainment", "Lifestyle"];
//     const [selectedCategory, setSelectedCategory] = useState("Entertainment");
//     const highlightRef = useRef(null);
//     const labelRefs = useRef({});

//     useEffect(() => {
//         const currentLabel = labelRefs.current[selectedCategory];
//         const highlight = highlightRef.current;
//         if (!currentLabel || !highlight) return;

//         const setHighlight = () => {
//             const rect = currentLabel.getBoundingClientRect();
//             const containerRect = currentLabel.parentElement.getBoundingClientRect();
//             const offset = 4;
//             highlight.style.width = `${rect.width}px`;
//             highlight.style.transform = `translateX(${rect.left - containerRect.left - offset}px)`;
//         };

//         const raf = requestAnimationFrame(() => {
//             setTimeout(setHighlight, 50);
//         });

//         const resizeObserver = new ResizeObserver(() => {
//             setHighlight();
//         });

//         resizeObserver.observe(currentLabel);

//         return () => {
//             cancelAnimationFrame(raf);
//             resizeObserver.disconnect();
//         };
//     }, [selectedCategory]);

//     const events = data?.events || [];

//     const formatDate = (dateString) => {
//         const dateObj = new Date(dateString);
//         const day = dateObj.getDate();
//         const month = dateObj.toLocaleString("default", { month: "short" });
//         const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
//         return `${day} ${month}${year}`;
//     };

//     return (
//         <div className="w-full">
//             {/* Header with Background Image */}
//             <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-screen">
//                 <div
//                     className="w-full h-[98%] bg-cover bg-no-repeat"
//                     style={{
//                         backgroundImage: `linear-gradient(90deg, rgba(18, 44, 59, 0.5), rgba(255, 71, 19, 0.3)), url(${event_image})`,
//                         backgroundPosition: "0% 0%, center center",
//                         backgroundRepeat: "repeat, no-repeat",
//                         backgroundAttachment: "scroll, scroll",
//                         backgroundSize: "cover",
//                         backgroundOrigin: "padding-box, padding-box",
//                         backgroundClip: "border-box, border-box",
//                     }}
//                 ></div>

//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide text-center px-2">
//                         Events Archive
//                     </h1>
//                 </div>
//             </div>

//             {/* Events Section */}
//             <div className="py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
//                 <h2 className="text-center text-xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">
//                     Past Events
//                 </h2>
//                 <hr className="border-t-2 border-orange-600 w-[200px] mx-auto mb-6" />
//                 <p className="text-center text-sm sm:text-lg md:text-xl lg:text-2xl font-extralight">
//                     BROWSE EVENT CATEGORIES
//                 </p>

//                 {/* Category Toggle */}
//                 <div className="flex justify-center mt-10 mb-12">
//                     <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex px-1 py-1 sm:py-2 w-full max-w-xs sm:max-w-md mx-auto">
//                         <div
//                             ref={highlightRef}
//                             className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
//                         ></div>

//                         {categories.map((category) => (
//                             <label
//                                 key={category}
//                                 ref={(el) => (labelRefs.current[category] = el)}
//                                 className={`relative z-10 cursor-pointer flex-1 text-center py-2 text-xs sm:text-sm md:text-base rounded-full font-normal transition-colors duration-300 ${selectedCategory === category ? "text-white" : "text-black"
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name="category"
//                                     value={category}
//                                     checked={selectedCategory === category}
//                                     onChange={() => setSelectedCategory(category)}
//                                     className="sr-only"
//                                 />
//                                 {category}
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Event Cards */}
//                 <div className="max-w-7xl mx-auto px-2 sm:px-4">
//                     {/* Event Cards Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                         {events.map((event, index) => (
//                             <Link to={`/event/${event.id}`} key={index}>
//                                 <div className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500 w-full h-80 flex flex-col">
//                                     {/* Date Badge */}
//                                     <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold z-10 rounded-bl-lg">
//                                         <div className="text-sm sm:text-base font-bold leading-tight">
//                                             {formatDate(event.from_time).split(" ")[0]}
//                                         </div>
//                                         <div className="text-xs sm:text-sm">{formatDate(event.from_time).split(" ")[1]}</div>
//                                     </div>

//                                     {/* Event Image */}
//                                     <img
//                                         src={event.attachfile?.document_url || "https://via.placeholder.com/400x300?text=No+Image"}
//                                         alt={event.event_name}
//                                         className="w-full h-44 sm:h-48 object-cover"
//                                         loading="lazy"
//                                     />

//                                     {/* Event Info */}
//                                     <div className="p-3 sm:p-4 bg-white flex-grow">
//                                         <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">{event.event_name}</h3>
//                                         <p className="text-xs sm:text-sm md:text-base text-gray-700">{event.project_name}</p>
//                                     </div>
//                                 </div>

//                             </Link>
//                         ))}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Event;


import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import event_image from "../assets/main_event.jpg";

const Event = () => {
  const categories = ["Entertainment", "Lifestyle"];
  const [selectedCategory, setSelectedCategory] = useState("Entertainment");
  const highlightRef = useRef(null);
  const labelRefs = useRef({});

  useEffect(() => {
    const currentLabel = labelRefs.current[selectedCategory];
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
  }, [selectedCategory]);

  const events = [
    {
      id: 1,
      event_name: "Luxury Movie Night",
      project_name: "Piramal Mahalaxmi",
      from_time: "2024-02-20T18:00:00",
      attachfile: {
        document_url: "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    },
    {
      id: 2,
      event_name: "Art & Wine Evening",
      project_name: "Piramal Aranya",
      from_time: "2024-03-10T19:00:00",
      attachfile: {
        document_url: "https://images.pexels.com/photos/670702/pexels-photo-670702.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    },
    {
      id: 3,
      event_name: "Wellness Retreat",
      project_name: "Piramal Revanta",
      from_time: "2024-04-05T08:30:00",
      attachfile: {
        document_url: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    },
    {
      id: 4,
      event_name: "Private Concert Night",
      project_name: "Piramal Vaikunth",
      from_time: "2024-05-15T20:00:00",
      attachfile: {
        document_url: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    }
  ];

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
    return `${day} ${month}${year}`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-screen">
        <div
          className="w-full h-[98%] bg-cover bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(18, 44, 59, 0.5), rgba(255, 71, 19, 0.3)), url(${event_image})`,
            backgroundPosition: "0% 0%, center center",
            backgroundSize: "cover"
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide text-center px-2">
            Events Archive
          </h1>
        </div>
      </div>

      {/* Events */}
      <div className="py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
        <h2 className="text-center text-xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">
          Past Events
        </h2>
        <hr className="border-t-2 border-orange-600 w-[200px] mx-auto mb-6" />
        <p className="text-center text-sm sm:text-lg md:text-xl lg:text-2xl font-extralight">
          BROWSE EVENT CATEGORIES
        </p>

        {/* Category Toggle */}
        <div className="flex justify-center mt-10 mb-12">
          <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex px-1 py-1 sm:py-2 w-full max-w-xs sm:max-w-md mx-auto">
            <div
              ref={highlightRef}
              className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
            ></div>

            {categories.map((category) => (
              <label
                key={category}
                ref={(el) => (labelRefs.current[category] = el)}
                className={`relative z-10 cursor-pointer flex-1 text-center py-2 text-xs sm:text-sm md:text-base rounded-full font-normal transition-colors duration-300 ${
                  selectedCategory === category ? "text-white" : "text-black"
                }`}
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id}>
                <div className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500 w-full h-80 flex flex-col">
                  {/* Date Badge */}
                  <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold z-10 rounded-bl-lg">
                    <div className="text-sm sm:text-base font-bold leading-tight">
                      {formatDate(event.from_time).split(" ")[0]}
                    </div>
                    <div className="text-xs sm:text-sm">{formatDate(event.from_time).split(" ")[1]}</div>
                  </div>

                  {/* Image */}
                  <img
                    src={
                      event.attachfile?.document_url ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={event.event_name}
                    className="w-full h-44 sm:h-48 object-cover"
                    loading="lazy"
                  />

                  {/* Info */}
                  <div className="p-3 sm:p-4 bg-white flex-grow">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">
                      {event.event_name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      {event.project_name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;

