import React from 'react';
import FeaturedPostSlider from '../Component/FeaturedPostSlider';

const Blog = () => {
    const slide = {
        bgImage:
            'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        heading: "KEE READER'S CLUB",
        subheading: 'Bringing together information and entertainment for you.',
        buttonText: 'Read More',
    };

    return (

        <div>
            <section
                className="relative min-h-[70vh] w-full bg-cover bg-center text-white flex items-center justify-center px-4 sm:px-6"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
                }}
            >
                <div className="text-center max-w-md sm:max-w-xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
                        {slide.heading}
                    </h1>
                    <div className="h-[2px] w-16 sm:w-24 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
                    <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 drop-shadow-sm px-2">
                        {slide.subheading}
                    </p>
                    <button className="bg-[#FF4F12] hover:bg-[#d93b18] px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white text-sm sm:text-base font-semibold shadow-md transition duration-300">
                        {slide.buttonText}
                    </button>
                </div>
            </section>
            <FeaturedPostSlider />
        </div>
    );
};

export default Blog;
