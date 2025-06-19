import React, { useEffect, useState } from 'react';
import FeaturedPostSlider from '../Component/blogpage/FeaturedPostSlider';
import LatestPosts from '../Component/blogpage/LatestPosts';

const Blog = () => {
    const slide = {
        bgImage: 'https://cdn.loyalie.in/82083460.jpg',
        heading: "KEE READER'S CLUB",
        subheading: 'Bringing together information and entertainment for you.',
        buttonText: 'Read More',
    };

    // Add state for featured posts
    const [featuredPosts, setFeaturedPosts] = useState([]);

    useEffect(() => {
        fetch('https://piramal-loyalty-dev.lockated.com/blog_posts.json')
            .then((res) => res.json())
            .then((data) => setFeaturedPosts(data))
            .catch(() => setFeaturedPosts([]));
    }, []);

    return (
        <div className="w-full">
            <section
                className="relative min-h-[70vh] w-full text-white flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-cover bg-center sm:bg-left-top bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
                }}
            >
                <div className="text-center max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
                        {slide.heading}
                    </h1>
                    <div className="h-[2px] w-16 sm:w-24 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
                    <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 drop-shadow-sm px-2 sm:px-0">
                        {slide.subheading}
                    </p>
                    <button className="bg-[#FF4F12] hover:bg-[#d93b18] px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-white text-sm sm:text-base font-semibold shadow-md transition duration-300">
                        {slide.buttonText}
                    </button>
                </div>
            </section>
            <div className="px-4 sm:px-6 lg:px-8 py-10">
                <FeaturedPostSlider posts={featuredPosts} />
                <LatestPosts/>
            </div>
        </div>
    );
};

export default Blog;
