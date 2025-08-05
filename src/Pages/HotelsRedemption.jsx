import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell } from 'lucide-react';
import promotionAPI from '../services/promotionAPI';

const HotelsRedemption = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [hotelData, setHotelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch hotels on component mount and when location changes
    useEffect(() => {
        fetchHotels();
    }, [selectedLocation]);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await promotionAPI.getHotels(selectedLocation);
            
            if (response.success) {
                setHotelData(response.data);
            } else {
                setError('Failed to load hotels');
                // Fallback to static data
                setHotelData(getStaticHotels());
            }
        } catch (err) {
            console.error('Error fetching hotels:', err);
            setError('Failed to load hotels');
            // Fallback to static data
            setHotelData(getStaticHotels());
        } finally {
            setLoading(false);
        }
    };

    const getStaticHotels = () => {
        return [
            {
                id: 1,
                name: "The Taj Mahal Palace",
                location: "Mumbai",
                image: "/src/assets/Hotel/hotel1.jpg",
                rating: 4.8,
                points: 25000,
                originalPrice: 45000,
                discountedPrice: 35000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Iconic luxury hotel overlooking the Gateway of India"
            },
            {
                id: 2,
                name: "The Oberoi",
                location: "Delhi",
                image: "/src/assets/Hotel/hotel2.jpg",
                rating: 4.9,
                points: 30000,
                originalPrice: 55000,
                discountedPrice: 40000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Contemporary luxury in the heart of New Delhi"
            },
            {
                id: 3,
                name: "ITC Grand Chola",
                location: "Chennai",
                image: "/src/assets/Hotel/hotel3.jpg",
                rating: 4.7,
                points: 28000,
                originalPrice: 48000,
                discountedPrice: 38000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Grand luxury hotel inspired by Chola architecture"
            },
            {
                id: 4,
                name: "Rambagh Palace",
                location: "Jaipur",
                image: "/src/assets/Hotel/Card1.png",
                rating: 4.9,
                points: 35000,
                originalPrice: 65000,
                discountedPrice: 50000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Former palace of Maharaja, now a luxury hotel"
            },
            {
                id: 5,
                name: "Wildflower Hall",
                location: "Shimla",
                image: "/src/assets/Hotel/Card2.png",
                rating: 4.8,
                points: 32000,
                originalPrice: 58000,
                discountedPrice: 45000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Luxury mountain resort in the Himalayas"
            },
            {
                id: 6,
                name: "Leela Palace",
                location: "Bangalore",
                image: "/src/assets/Hotel/Card3.png",
                rating: 4.6,
                points: 26000,
                originalPrice: 42000,
                discountedPrice: 32000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Contemporary luxury with traditional Indian hospitality"
            }
        ];
    };

    const locations = ['All', 'Mumbai', 'Delhi', 'Chennai', 'Jaipur', 'Shimla', 'Bangalore'];

    const filteredHotels = selectedLocation === 'All' 
        ? hotelData 
        : hotelData.filter(hotel => hotel.location === selectedLocation);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getAmenityIcon = (amenity) => {
        switch(amenity) {
            case 'Wifi': return <Wifi size={16} />;
            case 'Parking': return <Car size={16} />;
            case 'Restaurant': return <Utensils size={16} />;
            case 'Gym': return <Dumbbell size={16} />;
            default: return null;
        }
    };

    const handleHotelSelect = async (hotel) => {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('authToken');
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        // Log hotel booking intent
        try {
            await promotionAPI.bookHotel({
                id: hotel.id,
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                guests: 2,
                points: hotel.points
            });
        } catch (error) {
            console.error('Error logging hotel booking:', error);
        }
        
        // Navigate to hotel details page
        navigate(`/dashboard/hotel-details`, { state: { hotel } });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f9461c] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading hotels...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h3 className="text-xl text-red-600 mb-2">Error Loading Hotels</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button 
                        onClick={fetchHotels}
                        className="bg-[#f9461c] text-white px-6 py-2 rounded-lg hover:bg-[#e03d12]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Hotel Rewards</h1>
                <p className="text-gray-600">Redeem your points for luxury hotel stays across India</p>
            </div>

            {/* Location Filter */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    {locations.map((location) => (
                        <button
                            key={location}
                            onClick={() => setSelectedLocation(location)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedLocation === location
                                    ? "bg-[#f9461c] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                    <div
                        key={hotel.id}
                        onClick={() => handleHotelSelect(hotel)}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    >
                        {/* Hotel Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#f9461c] text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {hotel.location}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                                    <Star className="text-yellow-400 fill-current" size={14} />
                                    <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hotel Details */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-3">
                                <MapPin size={16} className="mr-1" />
                                <span className="text-sm">{hotel.location}</span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                            {/* Amenities */}
                            <div className="flex items-center space-x-3 mb-4">
                                {hotel.amenities.slice(0, 4).map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-1 text-gray-500">
                                        {getAmenityIcon(amenity)}
                                        <span className="text-xs">{amenity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Points Required:</span>
                                    <span className="text-lg font-bold text-[#f9461c]">
                                        🔹 {hotel.points.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Cash Price:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatPrice(hotel.originalPrice)}
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatPrice(hotel.discountedPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button className="w-full bg-[#24293c] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1a1f2e] transition-colors duration-300">
                                Book with Points
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600 mb-2">No hotels found</h3>
                    <p className="text-gray-500">Try selecting a different location</p>
                </div>
            )}
        </div>
    );
};

export default HotelsRedemption;
