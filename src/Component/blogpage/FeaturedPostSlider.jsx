import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedPostSlider = ({ posts }) => {
    // Ensure safePosts is always an array
    let safePosts = [];
    if (Array.isArray(posts)) {
        safePosts = posts;
    } else if (posts && typeof posts === 'object' && Array.isArray(posts.featured)) {
        safePosts = posts.featured;
    }

    const [current, setCurrent] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        if (!safePosts.length) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === safePosts.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [safePosts.length]);

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? safePosts.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev === safePosts.length - 1 ? 0 : prev + 1));
    };

    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/blog/${id}`);
    };

    // Format date as "14th November | 4 mins Read"
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('en-IN', { month: 'long' });
        // Add ordinal suffix
        const j = day % 10, k = day % 100;
        let dayStr = day + (j === 1 && k !== 11 ? "st" : j === 2 && k !== 12 ? "nd" : j === 3 && k !== 13 ? "rd" : "th");
        return `${dayStr} ${month} | 4 mins Read`;
    }

    console.log("Post:-",safePosts, typeof safePosts);
    
    // Use safePosts for mapping
    const mappedPosts = safePosts.map((post) => ({
        id: post.id,
        title: post.heading,
        date: formatDate(post.publish_date),
        description: post.summary,
        image: post.image_url || 'https://via.placeholder.com/600x400?text=No+Image',
        subtitle: '', // API doesn't provide subtitle
    }));

    const displayPosts = mappedPosts.length ? mappedPosts : [];

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
                    {displayPosts.length === 0 ? (
                        <div className="w-full flex items-center justify-center h-64">
                            <span>Loading...</span>
                        </div>
                    ) : (
                        displayPosts.map((post) => (
                            <div key={post.id} className="flex-shrink-0 w-full flex flex-col md:flex-row gap-8 px-4 items-center">

                                <div className="relative w-full md:w-1/2">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-64 md:h-80 object-cover shadow-md"
                                    />
                                    {/* Only show subtitle if present */}
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

                                    <button className="self-start bg-[#FD5E53] text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition" onClick={()=> handleCardClick(post.id)}>
                                        Read More &gt;
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-between mt-6 px-6 md:px-12">
                <button
                    onClick={handlePrev}
                    className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
                    disabled={displayPosts.length === 0}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
                    disabled={displayPosts.length === 0}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FeaturedPostSlider;