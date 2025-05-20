import React from 'react';
import HeroSection from '../Component/homepage/HeroSection';
import ProjectsCarousel from '../Component/homepage/ProjectsCarousel';
import MainCard from '../Component/homepage/MainCard';
import SignIn from '../Component/loginpages/signIn';
import Register from '../Component/loginpages/register';
import Forgot from '../Component/loginpages/Forgot';
import ForgotOtp from '../Component/loginpages/ForgotOtp';
import CreatePassword from '../Component/loginpages/CreatePassword';

const Login = () => {
  return (
    <div>
      <SignIn/>
      <Register/>
      <Forgot/>
      <ForgotOtp/>
      <CreatePassword/>
    </div>
  );
}

export default Login;
