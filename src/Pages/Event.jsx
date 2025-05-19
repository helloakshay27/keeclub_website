import React from 'react';

const Event = () => {

    const events = [
        {
            date: '23 Dec’24',
            title: 'JOIN THE FESTIVE HUNT',
            location: 'PIRAMAL',
            image: 'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734594095943_1734594094920_ChristmasGenricBanner.jpg',
        },
        {
            date: '17 Nov’24',
            title: 'LEGO WORKSHOP AT PIRAMAL REVANTA',
            location: 'PIRAMAL',
            image: 'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734594095943_1734594094920_ChristmasGenricBanner.jpg',
        },
        {
            date: '23 Sep’24',
            title: 'LEGO WORKSHOP AT PIRAMAL VAIKUNTH',
            location: 'PIRAMAL',
            image: 'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734594095943_1734594094920_ChristmasGenricBanner.jpg',
        },
    ];


    return (
        <div className="w-full">
            {/* Full Image Section */}
            <div className="w-full h-[40vh] sm:h-[60vh] md:h-screen bg-center bg-cover"
                style={{ backgroundImage: `url('https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1718107491641_1718107491065_KeeClub03primalevent.jpg')` }}
            >

            </div>

            {/* Past Events Section */}
            <div className="px-4 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">Past Events</h2>
                <hr className="border-t-4 border-orange-600 w-12 mx-auto mb-6" />

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <label className="flex items-center gap-2 text-base sm:text-lg">
                        <input type="checkbox" />
                        Entertainment
                    </label>
                    <label className="flex items-center gap-2 text-base sm:text-lg">
                        <input type="checkbox" />
                        Lifestyle
                    </label>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <div key={index} className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500">
                            {/* Date Badge */}
                            <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm font-semibold z-10 rounded-bl-lg">
                                <div className="text-base sm:text-lg font-bold leading-tight">
                                    {event.date.split(' ')[0]}
                                </div>
                                <div className="text-xs">{event.date.split(' ')[1]}</div>
                            </div>

                            {/* Image */}
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-52 sm:h-64 object-cover"
                            />

                            {/* Event Content */}
                            <div className="p-3 sm:p-4 bg-white">
                                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{event.title}</h3>
                                <p className="text-sm sm:text-base text-gray-700">{event.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Event;
