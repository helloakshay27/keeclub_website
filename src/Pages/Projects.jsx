import React from 'react';
import HeroSection from '../Component/HeroSection';
import ProjectsSection from '../Component/ProjectSection';
import SearchFilter from '../Component/SearchFilter';

const Projects = () => {
  return (
    <div>
      {/* Hero Banner Section */}
      <HeroSection />
      {/* <SearchFilter /> */}
      
      {/* Projects Section with Search, Listings and Map */}
      <ProjectsSection />
    </div>
  );
};

export default Projects;