import React, { useState } from 'react';
import SearchFilter from './SearchFilter';
import ProjectsList from './ProjectList';

const ProjectsSection = () => {
  // Add view state: "list" or "grid"
  const [view, setView] = useState("list");

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilter view={view} setView={setView} />
      <div className="grid grid-cols-1 gap-8">
        <div className="mt-4 md:mt-6 lg:mt-8">
          <ProjectsList view={view} />
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
