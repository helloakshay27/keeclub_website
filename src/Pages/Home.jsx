import React from 'react';
import HeroSection from '../Component/HeroSection';
import MainCard from '../Component/MainCard';
import ProjectsCarousel from '../Component/ProjectsCarousel';

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <MainCard/>
      <ProjectsCarousel/>
    </div>
  );
}

export default Home;
