import React from 'react';
import SearchFilter from './SearchFilter';
import ProjectsList from './ProjectList';

const ProjectsSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilter />
      <div className="grid grid-cols-1  gap-8">
        <div className="mt-4 md:mt-6 lg:mt-8">
          <ProjectsList />
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
