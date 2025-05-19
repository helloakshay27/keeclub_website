import React from 'react';
import SearchFilter from './SearchFilter';
import ProjectsList from './ProjectList';
import MapComponent from './MapComponent';
// import MapComponent from './MapComponent';

const ProjectsSection = () => {
  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Search and Filter Bar */}
      <SearchFilter />
      
      {/* Main Content Area */}
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Projects List Column */}
        <div>
          <ProjectsList />
        </div>
        
        {/* Map Column */}
        <div className="sticky top-24">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;