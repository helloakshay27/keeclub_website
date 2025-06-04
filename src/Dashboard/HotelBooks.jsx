import React from 'react';
import card3 from "../assets/Hotel/Card3.png";


const HotelBooks = () => {
  return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold">THANK YOU FOR YOUR BOOKING</h1>
            <p className="text-black opacity-50 mt-2 ">Your reservation is now confirmed</p>
          </div>
    
          {/* Reservation Details */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Box */}
            <div className="flex-1 border border-[#D1D1D1] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">
                Coastal Gateway Resort, 3 min walk to Nagaon Beach
              </h2>
    
              <div className="grid grid-cols-3 gap-y-6 text-sm text-gray-600">
                <div>
                  <p className="mb-1">Check-in Date :</p>
                  <p className="text-black font-medium">12th May 2025</p>
                </div>
                <div>
                  <p className="mb-1">Check-out Date :</p>
                  <p className="text-black font-medium">15th May 2025</p>
                </div>
                <div>
                  <p className="mb-1">Number of Nights :</p>
                  <p className="text-black font-medium">3 nights</p>
                </div>
                <div>
                  <p className="mb-1">Guests</p>
                  <p className="text-black font-medium">2 adults, 4 children</p>
                </div>
                <div>
                  <p className="mb-1">Number of rooms booked</p>
                  <p className="text-black font-medium">2 adults, 4 children</p>
                </div>
              </div>
            </div>
    
            {/* Right Image */}
            <div className="flex-1">
              <img
                src={card3}
                alt="Hotel"
                className="w-full h-full max-h-[270px] object-cover rounded-lg"
              />
            </div>
          </div>
    
          {/* Cancellation Policy */}
          <div className="bg-white border border-[#D1D1D1] rounded-lg mt-8 p-6">
            <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
            <ul className="text-sm text-gray-700 list-decimal list-inside space-y-2">
              <li>Fully refundable before Sat, 7 Jun</li>
              <li className='w-md'>
                Cancellations or changes made after 18:00 (property local time) on 7 Jun 2025 or
                no-shows are subject to a property fee equal to 100% of the total amount paid for
                the reservation.
              </li>
            </ul>
          </div>
        </div>
  );
};

export default HotelBooks;
