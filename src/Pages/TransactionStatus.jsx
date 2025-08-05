import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TransactionStatus = () => {
    const navigate = useNavigate();

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

    // Sample orders for tracking
    const recentOrders = [
        { 
            id: "4567", 
            product: "Tissot T-Race MotoGP", 
            status: "Delivered", 
            date: "2025-07-28",
            points: 65000
        },
        { 
            id: "4568", 
            product: "Longines Conquest", 
            status: "In Transit", 
            date: "2025-08-01",
            points: 95000
        }
    ];


    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
        return `${day} ${month}${year}`;
    };


    // Tab UI state
    const [selectedTab, setSelectedTab] = useState("Featured Product");
    const tabList = ["Featured Product", "Redemption Market Place", "Encash"];

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
                    <div className="h-[2px] w-16 sm:w-50 bg-[#f9461c] my-3 sm:my-4 mx-auto" />
                </div>
            </section>

            {/* Tab UI like provided example */}
            <div className="w-full mt-10">
                <div className="flex justify-center w-full">
                    <div className="flex bg-gray-100 rounded-full w-full border border-gray-200" style={{padding: '4px'}}>
                        {tabList.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`flex-1 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                    selectedTab === tab
                                        ? "bg-[#f9461c] text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full mt-10">
                <div className="overflow-hidden max-w-6xl mx-auto">
                    <div
                        ref={scrollRef}
                        className="flex transition-transform duration-500 ease-in-out overflow-x-auto sm:overflow-x-hidden scroll-smooth snap-x sm:snap-none no-scrollbar"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {pointsData.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[90%] sm:w-[calc(100%/3)] px-4 snap-center"
                            >
                                <div className="bg-white rounded-xl text-center px-6 py-10 border border-gray-200 h-[250px] md:h-auto flex flex-col justify-center">
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

            {/* Recent Orders Section */}
            <div className="px-4 py-8 sm:py-10 max-w-7xl mx-auto">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3 uppercase">Recent Orders</h2>
                <hr className="border-t-2 border-orange-600 w-12 mx-auto mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                                    <p className="text-gray-600">{order.product}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    order.status === 'Delivered' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span className="font-medium">{order.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Points Used:</span>
                                    <span className="font-medium text-orange-600">⭐ {order.points.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/track-order/${order.id}`, {
                                    state: {
                                        product: {
                                            name: order.product.split(' ')[0],
                                            title: order.product,
                                            points: order.points,
                                            image: "/src/assets/Hotel/Card1.png"
                                        },
                                        orderId: order.id
                                    }
                                })}
                                className="w-full bg-[#24293c] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1a1f2e] transition-colors"
                            >
                                Track Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TransactionStatus;
