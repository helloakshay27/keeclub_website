import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  'https://cdn.loyalie.in/21060060.png',
  'https://cdn.loyalie.in/89999699.png',
  'https://cdn.loyalie.in/38253813.png',
  'https://cdn.loyalie.in/38253813.png',
];

const ProjectsCarousel = () => {
  const scrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const visibleCountDesktop = 3; // Default visible cards for desktop
  const mobileVisibleCount = 1.2; // Show 1 full card + part on mobile

  // Returns how many cards are visible based on window width
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return mobileVisibleCount;
      if (window.innerWidth < 1024) return 2;
    }
    return visibleCountDesktop;
  };

  // Store visibleCount in state and update on resize
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll container to position for given index
  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate child width assuming equal width cards
    const childWidth = container.scrollWidth / projects.length;

    container.scrollTo({
      left: childWidth * index,
      behavior: 'smooth',
    });
  };

  // Handle left/right scroll button click
  const scroll = (direction) => {
    const maxScrollIndex = Math.ceil(projects.length - visibleCount);
    const newIndex =
      direction === 'left'
        ? Math.max(scrollIndex - 1, 0)
        : Math.min(scrollIndex + 1, maxScrollIndex);

    scrollToIndex(newIndex);
    setScrollIndex(newIndex);
  };

  // Auto scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => {
        const maxIndex = Math.ceil(projects.length - visibleCount);
        const next = (prev + 1) > maxIndex ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [visibleCount]);

  return (
    <section className="w-full py-16 flex flex-col items-center bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#FF4F12] text-center">
        Projects
      </h2>
      <div className="h-[2px] w-24 bg-[#FF4F12] mt-2 mb-12" />

      <div className="relative w-full max-w-6xl px-4 sm:px-6 ">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7"/>
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden scroll-smooth transition-all duration-500"
        >
          {projects.map((image, index) => (
            <div
              key={index}
              className="min-w-[80%] sm:min-w-[45%] md:min-w-[33.33%] flex-shrink-0 flex justify-center items-center"
            >
              <img
                src={image}
                alt={`Project ${index}`}
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/300x200?text=No+Image';
                }}
                className="w-full object-contain h-40 sm:h-48 md:h-56 max-h-[150px]"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
