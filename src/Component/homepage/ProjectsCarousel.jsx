import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Piramal_Aranya from "../../assets/ProjectImg/Piramal_Aranya.png";
import Piramal_Mahalaxmi from "../../assets/ProjectImg/Piramal_Mahalaxmi.png";
import Piramal_Revanta from "../../assets/ProjectImg/Piramal_Revanta.png";
import Piramal_Vaikunth from "../../assets/ProjectImg/Piramal_Vaikunth.png";
import useApiFetch from "../../hooks/useApiFetch";
import BASE_URL from "../../Confi/baseurl";

const ProjectsCarousel = () => {
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
    { name: 'Piramal Revanta', image: Piramal_Revanta, id: projectIds[3] },
    { name: 'Piramal Vaikunth', image: Piramal_Vaikunth, id: projectIds[2] }
  ];

  return (
    <section className="w-full py-16 flex flex-col items-center bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#FF4F12] text-center">
        Projects
      </h2>
      <div className="h-[2px] w-24 bg-[#FF4F12] mt-2 mb-12" />

      <div className="w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {projects.map((project, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center items-center"
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
      </div>
    </section>
  );
};

export default ProjectsCarousel;