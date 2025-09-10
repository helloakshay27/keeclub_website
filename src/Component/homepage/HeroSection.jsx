import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const slides = [
  {
    id: 1,
    bgImage:
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'HOMES ARE MEANT TO BE MORE,',
    subheading: 'Because every apartment becomes a world by itself.',
    title: 'KEE CLUB',
    description: 'A joint initiative by Piramal Realty and Lockated',
    buttonText: 'Refer Now',
  },
  {
    id: 2,
    bgImage:
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'HOMES ARE MEANT TO BE MORE,',
    subheading: 'Because every apartment becomes a world by itself.',
    title: 'KEE CLUB',
    description: 'A joint initiative by Piramal Realty and Lockated',
    buttonText: 'Refer Now',
  },
  {
    id: 3,
    bgImage:
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heading: 'HOMES ARE MEANT TO BE MORE,',
    subheading: 'Because every apartment becomes a world by itself.',
    title: 'KEE CLUB',
    description: 'A joint initiative by Piramal Realty and Lockated',
    buttonText: 'Refer Now',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // ✅ MUST be inside component function
  let id = localStorage.getItem("Loyalty_Member_Unique_Id__c")?.replace(/^0+/, '');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReferNowClick = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate(`/dashboard/transactions/${id}`);
    } else {
      toast.info('Please login to continue');
      navigate('/login');
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-1000"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full h-full relative"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(18, 44, 59, 0.6), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 h-full w-full flex flex-col items-center text-center px-4 text-white pt-28 mt-36 md:pt-32 lg:pt-25">
              <h1 className="text-[18px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-semibold uppercase tracking-wide drop-shadow-lg">
                {slide.heading}
              </h1>
              <p className="text-[15px] sm:text-[15px] md:text-[15px] lg:text-[28px] font-light tracking-wide mb-6 max-w-4xl drop-shadow-md px-2 sm:px-0">
                {slide.subheading}
              </p>
              <h2 className="text-4xl sm:text-[44px] md:text-5xl lg:text-6xl font-extrabold tracking-widest drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-[13px] sm:text-[12px] md:text-[15px] mb-6 drop-shadow-md max-w-xl px-4">
                {slide.description}
              </p>

              <button
                className="bg-[#fa4615] hover:bg-[#d93b18] px-6 sm:px-8 py-2 sm:py-3 rounded-[1px] text-white text-sm sm:text-sm font-normal shadow-lg transition"
                onClick={handleReferNowClick}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
