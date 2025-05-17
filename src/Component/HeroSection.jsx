import React, { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    bgImage:
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'HOMES ARE MEANT TO BE MORE,',
    subheading: 'Because every apartment becomes a world by itself.',
    title: 'KEE CLUB',
    description: 'A joint initiative by Piramal Realty and Reloy',
    buttonText: 'Refer Now',
  },
  {
    id: 2,
    bgImage:
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'FIND YOUR PERFECT SPACE,',
    subheading: 'Every corner curated for your comfort.',
    title: 'KEE CLUB',
    description: 'A lifestyle experience like no other.',
    buttonText: 'Explore Now',
  },
  {
    id: 3,
    bgImage:
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'MORE THAN JUST A HOME,',
    subheading: 'A destination for dreams.',
    title: 'KEE CLUB',
    description: 'Powered by Piramal Realty and Reloy',
    buttonText: 'Join Us',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-1000"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full h-full relative"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(18, 44, 59, 0.6), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 h-full w-full flex flex-col items-center text-center px-4 text-white pt-28 mt-36 md:pt-32 lg:pt-40">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-wide mb-4 drop-shadow-lg">
                {slide.heading}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md px-2 sm:px-0">
                {slide.subheading}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-widest mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 drop-shadow-md max-w-xl px-4">
                {slide.description}
              </p>
              <button className="bg-[#F24822] hover:bg-[#d93b18] px-6 sm:px-8 py-2 sm:py-3 rounded-md text-white text-base sm:text-lg font-semibold shadow-lg transition">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
