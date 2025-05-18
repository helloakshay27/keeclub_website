import React from 'react';

const Card = ({
  imageUrl,
  title,
  subtitle,
  highlightColor = '#FF4F12',
  description,
  buttonText = 'Know More',
  onButtonClick,
  reverse = false,
}) => {
  return (
    <div
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } w-full max-w-7xl md:h-[80vh] overflow-hidden shadow-lg bg-white`}
    >
      {/* Left Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full">
        <img
          src={imageUrl}
          alt="Card Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1D]">
          {title}
        </h2>

        {subtitle && (
          <p className="text-base md:text-lg font-medium text-[#1D1D1D] mt-2">
            {subtitle}
          </p>
        )}

        <div
          className="w-12 h-1 mt-4 mb-6"
          style={{ backgroundColor: highlightColor }}
        />

        <div className="text-[#5D6A83] text-sm md:text-base leading-relaxed">
          {description}
        </div>

        {onButtonClick && (
          <button
            onClick={onButtonClick}
            className="mt-6 md:mt-8 w-max px-5 py-2 md:px-6 md:py-3 text-white font-semibold"
            style={{ backgroundColor: highlightColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#e5430a')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = highlightColor)
            }
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
