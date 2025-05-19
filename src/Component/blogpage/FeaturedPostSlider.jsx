import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const posts = [
    {
        id: 1,
        title: 'Ace the Board Games Trivia: Win Exciting Rewards',
        date: '15th January | 4 mins Read',
        description:
            'Play our Board Games Trivia Challenge and win exciting lifestyle vouchers!',
        image:
            'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1736847736952_1736847736629_BlogBannersAllClients.jpg',
        subtitle: 'HAPPY WORLD TOURISM DAY',
    },
    {
        id: 2,
        title: 'Children’s Day – Cartoon Quiz',
        date: '14th November | 4 mins Read',
        description:
            'This Children’s Day let’s celebrate the joy and creativity of childhood with a fun Cartoon Quiz! 🧸✨.',
        image:
            'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1731330888660_1731330887909_GenrBannerS.jpg',
    },
    {
        id: 3,
        title: 'Independence Day Trivia',
        date: '13th August | 4 mins Read',
        description: 'How well do you know the Heroes of our Nation?',
        image:
            'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1723467963601_1723467962863_Independence.jpg',
    },
    {
        id: 4,
        title: 'Welcome to the Ultimate Christmas Treasure Hunt! 🎁✨',
        date: '19th December | 4 mins Read',
        description:
            'Congratulations, you’re in the game! 🎄 This is the start of our Christmas Treasure Hunt,',
        image:
            'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734598376035_1734598374974_ChristmasblogGenricBannerV4.jpg',
    },
    {
        id: 5,
        title: 'World Tourism Day',
        date: '27th September | 4 mins Read',
        description:
            'World Tourism Day on 27th September celebrates the cultural and economic impact of tourism.',
        image:
            'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1727246811696_1727246811459_Blo.jpg',
    },
];

const FeaturedPostSlider = () => {
    const [current, setCurrent] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 relative">
            <h2 className="text-3xl md:text-4xl font-normal text-center mb-12">FEATURED POST</h2>

            {/* Carousel Container */}
            <div className="overflow-hidden relative">
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${current * 100}%)`,
                    }}
                >
                    {posts.map((post) => (
                        <div key={post.id} className="flex-shrink-0 w-full flex flex-col md:flex-row gap-8 px-4 items-center">

                            <div className="relative w-full md:w-1/2">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-64 md:h-80 object-cover shadow-md"
                                />
                                {post.subtitle && (
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent py-4 text-center text-xl font-semibold">
                                        {post.subtitle}
                                    </div>
                                )}
                            </div>

                            {/* Right: Text & Button */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <p className="uppercase font-bold text-gray-800 mb-1">FEATURED POST</p>
                                <h3 className="text-2xl md:text-3xl font-extrabold mb-3">{post.title}</h3>
                                <p className="font-semibold text-gray-700 mb-2">{post.date}</p>
                                <p className="text-gray-700 text-lg mb-4">{post.description}</p>

                                <button className="self-start bg-[#FD5E53] text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition">
                                    Read More &gt;
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-between mt-6 px-6 md:px-12">
                <button
                    onClick={handlePrev}
                    className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FeaturedPostSlider;
