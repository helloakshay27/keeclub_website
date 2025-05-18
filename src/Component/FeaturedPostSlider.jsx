import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'WORLD TOURISM DAY',
    date: '27TH SEPTEMBER | 4 MINS READ',
    description:
      'World Tourism Day on 27th September celebrates the cultural and economic impact of tourism.',
    image:
      'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1736847736952_1736847736629_BlogBannersAllClients.jpg',
    subtitle: 'HAPPY WORLD TOURISM DAY',
  },
  {
    id: 2,
    title: 'INTERNATIONAL HERITAGE DAY',
    date: '18TH APRIL | 3 MINS READ',
    description:
      'Heritage Day promotes preservation of historic monuments and sites globally.',
    image:
      'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1731330888660_1731330887909_GenrBannerS.jpg',
    subtitle: 'HONOURING WORLD HERITAGE',
  },
  {
    id: 3,
    title: 'INTERNATIONAL YOGA DAY',
    date: '21ST JUNE | 5 MINS READ',
    description:
      'Yoga Day celebrates the ancient Indian practice for physical and mental well-being.',
    image:
      'https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1731330888660_1731330887909_GenrBannerS.jpg',
    subtitle: 'BALANCE THROUGH YOGA',
  },
];

const FeaturedPostSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Clean up
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const post = posts[current];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl md:text-4xl font-normal text-center mb-15">FEATURED POST</h2>
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Image */}
        <div className="relative w-full md:w-1/2">
          <img
            src={post.image}
            alt={post.title}
            className="w-full shadow-md object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent py-4 text-center text-xl font-semibold">
            {post.subtitle}
          </div>
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2">
          <p className="uppercase font-bold text-gray-800 mb-1">FEATURED POST</p>
          <h3 className="text-3xl font-extrabold mb-3">{post.title}</h3>
          <p className="font-semibold text-gray-700 mb-2">{post.date}</p>
          <p className="text-gray-700 text-lg">
            {post.description}{' '}
            <span className="text-[#FD5E53] font-medium cursor-pointer">Read More &gt;</span>
          </p>
        </div>
      </div>

      {/* Arrows */}
      <div className="flex justify-between mt-6 px-6 md:px-12">
        <button
          onClick={handlePrev}
          className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="bg-[#FD5E53] text-white p-2 rounded-lg shadow hover:opacity-80 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedPostSlider;
