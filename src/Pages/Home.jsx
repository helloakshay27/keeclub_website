import React from 'react';
import HeroSection from '../Component/homepage/HeroSection';
import ProjectsCarousel from '../Component/homepage/ProjectsCarousel';
import MainCard from '../Component/homepage/MainCard';

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
