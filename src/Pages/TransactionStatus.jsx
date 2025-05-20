import { useEffect, useRef, useState } from "react";

const TransactionStatus = () => {
    const slide = {
        bgImage: 'https://images.pexels.com/photos/6214370/pexels-photo-6214370.jpeg?auto=compress&cs=tinysrgb&w=1200',
        heading: "TRANSACTION STATUS",
    };

    const pointsData = [
        { label: 'ALL THE POINTS EARNED', value: 0 },
        { label: 'ALL THE POINTS REDEEMED', value: 0 },
        { label: 'BALANCED POINTS', value: 0 },
        { label: 'ALL THE POINTS REDEEMED', value: 0 },
        { label: 'BALANCED POINTS', value: 0 },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCards = 3;
    const autoScrollInterval = 3000; // ms

    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev =>
                (prev + 1) % (pointsData.length - visibleCards + 1)
            );
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth * (currentIndex / pointsData.length),
                behavior: 'smooth',
            });
        }
    }, [currentIndex]);


    const events = [
        { date: "2025-05-01 10:00:00", transactionType: "Credit", points: 150 },
        { date: "2025-05-05 14:30:00", transactionType: "Debit", points: 75 },
        { date: "2025-05-10 09:00:00", transactionType: "Credit", points: 200 },
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

            <div className="w-full mt-10">
                <div className="overflow-hidden max-w-6xl mx-auto">
                    <div
                        ref={scrollRef}
                        className="flex transition-transform duration-500 ease-in-out overflow-x-hidden"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {pointsData.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[calc(100%/3)] px-4"
                            >
                                <div className="bg-white rounded-xl  text-center px-6 py-10 border border-gray-200">
                                    <div className="text-orange-400 text-4xl font-bold mb-3">
                                        {item.value}
                                    </div>
                                    <div className="text-black font-semibold text-lg tracking-wide">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-8 sm:py-10 md:py-20 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3 uppercase">Activity Log</h2>
                <hr className="border-t-2 border-orange-600 w-12 mx-auto mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="rounded shadow-md overflow-hidden relative border-b-2 border-orange-500 bg-white p-6"
                        >
                            <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 text-sm font-semibold z-10 rounded-bl-lg text-center">
                                <div className="text-base sm:text-lg font-bold leading-tight">
                                    {formatDate(event.date).split(' ')[0]}
                                </div>
                                <div className="text-xs">{formatDate(event.date).split(' ')[1]}</div>
                            </div>

                            <h3 className="text-lg font-bold mb-3">{event.transactionType}</h3>

                            <p className="text-gray-700 text-xl font-semibold">{event.points}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TransactionStatus;
