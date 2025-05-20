import React from 'react';

const TransactionStatus = () => {
    const slide = {
        bgImage: 'https://images.pexels.com/photos/6214370/pexels-photo-6214370.jpeg?auto=compress&cs=tinysrgb&w=1200',
        heading: "TRANSACTION STATUS",
    };

    const events = [
        {
            event_name: "Annual Maintenance Check",
            project_name: "Sai Radhe Bund Garden",
            from_time: "2025-05-01 10:00:00",
            attachfile: {
                document_url: "https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
        },
        {
            event_name: "HVAC System Upgrade",
            project_name: "Westport Baner",
            from_time: "2025-05-05 14:30:00",
            attachfile: {
                document_url: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
        },
        {
            event_name: "Fire Safety Audit",
            project_name: "Peninsula Office",
            from_time: "2025-05-10 09:00:00",
            attachfile: {
                document_url: "https://images.pexels.com/photos/2081105/pexels-photo-2081105.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
        },
    ];

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
        return `${day} ${month}${year}`;
    };

    return (
        <div className="w-full">
            <section
                className="relative min-h-[70vh] w-full text-white flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
                }}
            >
                <div className="text-center max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
                        {slide.heading}
                    </h1>
                    <div className="h-[2px] w-16 sm:w-50 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
                </div>
            </section>

            <div className="px-4 py-8 sm:py-10 md:py-20 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3 uppercase">Activity Log</h2>
                <hr className="border-t-2 border-orange-600 w-12 mx-auto mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500"
                        >
                            {/* Date Badge */}
                            <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm font-semibold z-10 rounded-bl-lg">
                                <div className="text-base sm:text-lg font-bold leading-tight">
                                    {formatDate(event.from_time).split(' ')[0]}
                                </div>
                                <div className="text-xs">{formatDate(event.from_time).split(' ')[1]}</div>
                            </div>

                            {/* Image */}
                            <img
                                src={event.attachfile?.document_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={event.event_name}
                                className="w-full h-52 sm:h-64 object-cover"
                            />

                            {/* Event Content */}
                            <div className="p-3 sm:p-4 bg-white">
                                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{event.event_name}</h3>
                                <p className="text-sm sm:text-base text-gray-700">{event.project_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TransactionStatus;
