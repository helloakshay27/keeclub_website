import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Piramal_Aranya from "../../assets/ProjectImg/Piramal_Aranya.png";
import Piramal_Mahalaxmi from "../../assets/ProjectImg/Piramal_Mahalaxmi.png";
import Piramal_Revanta from "../../assets/ProjectImg/Piramal_Revanta.png";
import Piramal_Vaikunth from "../../assets/ProjectImg/Piramal_Vaikunth.png";
import useApiFetch from "../../hooks/useApiFetch";
import BASE_URL from "../../Confi/baseurl";

const ProjectsCarousel = () => {
  const scrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [projectIds, setProjectIds] = useState([]);

  const { data } = useApiFetch(`${BASE_URL}get_all_projects.json`);

  useEffect(() => {
    if (data && data.projects) {
      const ids = data.projects.map((project) => project.id);
      setProjectIds(ids);
    }
  }, [data]);

  const projects = [
    { name: 'Piramal Aranya', image: Piramal_Aranya, id: projectIds[0] },
    { name: 'Piramal Mahalaxmi', image: Piramal_Mahalaxmi, id: projectIds[1] },
    { name: 'Piramal Revanta', image: Piramal_Revanta, id: projectIds[2] },
    { name: 'Piramal Vaikunth', image: Piramal_Vaikunth, id: projectIds[3] }
  ];

  const visibleCountDesktop = 3;
  const mobileVisibleCount = 1.2;

  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return mobileVisibleCount;
      if (window.innerWidth < 1024) return 2;
    }
    return visibleCountDesktop;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const childWidth = container.scrollWidth / projects.length;

    container.scrollTo({
      left: childWidth * index,
      behavior: 'smooth',
    });
  };

  const scroll = (direction) => {
    const maxScrollIndex = Math.ceil(projects.length - visibleCount);
    const newIndex =
      direction === 'left'
        ? Math.max(scrollIndex - 1, 0)
        : Math.min(scrollIndex + 1, maxScrollIndex);

    scrollToIndex(newIndex);
    setScrollIndex(newIndex);
  };

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
  }, [visibleCount, projects]);

  return (
    <section className="w-full py-16 flex flex-col items-center bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#FF4F12] text-center">
        Projects
      </h2>
      <div className="h-[2px] w-24 bg-[#FF4F12] mt-2 mb-12" />

      <div className="relative w-full max-w-6xl px-4 sm:px-6 ">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden scroll-smooth transition-all duration-500"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="min-w-[80%] sm:min-w-[45%] md:min-w-[33.33%] flex-shrink-0 flex justify-center items-center"
            >
              <Link
                to={`/project-details/${project.id}`}
                className="w-full"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                  className="w-full object-contain h-40 sm:h-48 md:h-56 max-h-[180px]"
                />
              </Link>
            </div>
          ))}
        </div>

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