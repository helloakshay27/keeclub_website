import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">Oops! Page not found.</p>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 cursor-pointer py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
