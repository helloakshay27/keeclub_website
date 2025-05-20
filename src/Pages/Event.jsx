import { Link } from "react-router-dom";
import useApiFetch from "../hooks/useApiFetch";

const Event = () => {
    const { data } = useApiFetch('https://api-connect.panchshil.com/events.json');

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
            <div
                className="w-full h-[40vh] sm:h-[60vh] md:h-screen bg-center bg-cover"
                style={{
                    backgroundImage: `url('https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1718107491641_1718107491065_KeeClub03primalevent.jpg')`
                }}
            ></div>

            <div className="px-4 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-orange-600 mb-3 uppercase">Past Events</h2>
                <hr className="border-t-4 border-orange-600 w-12 mx-auto mb-6" />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <Link to={`/event/${index}`} key={index}>
                            <div
                                className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500"
                            >
                                <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm font-semibold z-10 rounded-bl-lg">
                                    <div className="text-base sm:text-lg font-bold leading-tight">
                                        {formatDate(event.from_time).split(' ')[0]}
                                    </div>
                                    <div className="text-xs">{formatDate(event.from_time).split(' ')[1]}</div>
                                </div>

                                <img
                                    src={event.attachfile?.document_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={event.event_name}
                                    className="w-full h-52 sm:h-64 object-cover"
                                />
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
