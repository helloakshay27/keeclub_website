import React from 'react';
import card3 from "../assets/Hotel/Card3.png";
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';



const HotelCheckout = () => {
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <h1 className='font-semibold text-2xl'>Secure Booking</h1>
            {/* Refund Info */}
            <div className="border border-[#D1D1D1] p-4 rounded-lg ">
                <div className="flex items-center gap-4">
                    <CalendarDays className="w-8 h-8 text-black mt-0.5" />
                    <div>
                        <p className="font-semibold">Fully refundable before Sat, 7 Jun, 18:00 (property local time)</p>
                        <p className="text-sm text-gray-600">You can change or cancel this stay for a full refund if plans change. Because flexibility matters.</p>
                    </div>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Side - Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="border border-[#D1D1D1] rounded-lg p-4">
                        <h2 className="font-semibold text-lg mb-2">Who's checking in?</h2>
                        <p className="text-sm mb-4">Room 1: 2 Adults 2 Double Beds Non-smoking</p>
                        <div className='flex items-center gap-4 mb-4 w-full'>
                            <div>
                                <label className="text-sm block mb-1">First name*</label>
                                <input className="border rounded p-2 w-full" type="text" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Last name*</label>
                                <input className="border rounded p-2 w-full" type="text" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm block mb-1">Email address*</label>
                            <input className="border rounded p-2 w-[62.5%]" type="email" />
                        </div>
                        <div className='flex items-center gap-4 mt-4 w-full'>

                            <div>
                                <label className="text-sm block mb-1">Country/Region*</label>
                                <input className="border rounded p-2 w-full" type="text" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Phone number*</label>
                                <input className="border rounded p-2 w-full" type="tel" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border border-[#D1D1D1] rounded-lg p-4">
                        <h2 className="font-semibold text-lg mb-4">Payment method</h2>

                        {/* Name on Card - First Line */}
                        <div className="mb-4">
                            <input
                                className="border rounded p-2 w-full"
                                type="text"
                                placeholder="Name on Card*"
                            />
                        </div>

                        {/* Card Number - Second Line */}
                        <div className="mb-4">
                            <input
                                className="border rounded p-2 w-full"
                                type="text"
                                placeholder="Debit/Credit card number*"
                            />
                        </div>

                        {/* Expiry Date + Security Code - Third Line */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex gap-2">
                                <select className="border rounded p-2 w-full">
                                    <option>Month</option>
                                </select>
                                <select className="border rounded p-2 w-full">
                                    <option>Year</option>
                                </select>
                            </div>
                            <input
                                className="border rounded p-2 w-full"
                                type="text"
                                placeholder="Security code*"
                            />
                        </div>
                    </div>

                </div>

                {/* Right Side - Booking Summary */}
                <div className="space-y-6">
                    {/* Hotel Info */}
                    <div className="border border-[#D1D1D1] rounded-lg overflow-hidden">
                        <img
                            className="w-full h-40 object-cover"
                            src={card3}
                            alt="Hotel"
                        />
                        <div className="p-4">
                            <h2 className="font-semibold">Outpost</h2>
                            <div className="border-b border-gray-300 my-2"></div>
                            <div className="flex items-center gap-2 text-sm mt-4">
                                <span className="bg-[#FA46151A] px-2 py-0.5 rounded">3.8</span>
                                <span>Excellent</span>
                                <span className="text-gray-500">(10 reviews)</span>
                            </div>
                            <p className="text-sm mt-3 mb-4">1 Room: Deluxe Quadruple Room</p>
                            <p className="text-sm">Check-in: Sat, 14 Jun</p>
                            <p className="text-sm">Check-out: Sun, 15 Jun</p>
                            <p className="text-sm">1-night stay</p>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="border border-[#D1D1D1] rounded-lg p-4">
                        <h2 className="font-semibold text-lg mb-4">Price Details</h2>
                        <div className="border-b border-gray-300 my-2"></div>
                        <div className="text-sm flex justify-between mb-4">
                            <span>1 room x 1 night</span>
                            <span>₹10,000.00</span>
                        </div>
                        <div className="text-sm flex justify-between">
                            <span>Taxes</span>
                            <span>₹810.00</span>
                        </div>
                        <div className="border-b border-gray-300 my-2"></div>
                        <div className="font-semibold flex justify-between mt-2">
                            <span>Total</span>
                            <span>₹10810.00</span>
                        </div>
                        <p className="text-sm text-[#FA4615] mt-1 underline">Use a coupon credit or promotion code</p>
                        <Link to="/dashboard/hotel-book">
                            <button className="w-full cursor-pointer mt-4 bg-black text-white rounded p-2">Confirm Booking</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Cancellation Policy */}

        </div>
    );
};

export default HotelCheckout;