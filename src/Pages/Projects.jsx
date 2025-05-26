import React from 'react';
import ProjectsSection from '../Component/projectpage/ProjectSection';

const Projects = () => {
  const slide = {
    bgImage: 'https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/12674882.jpg',
    heading: "PIRAMAL PROJECTS",
  };

  return (
    <div className="w-full">
      <section
        className="relative min-h-[70vh] w-full text-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
        }}
      >
        <div className="text-center max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
            {slide.heading}
          </h1>
          <div className="h-[2px] w-12 sm:w-24 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ProjectsSection />
      </div>
    </div>
  );
};

export default Projects;
