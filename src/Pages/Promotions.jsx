import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Redemptions from './Redemptions';
import Encash from './Encash';
import promotionAPI from '../services/promotionAPI';
import RedemptionBg from '../assets/RedemptionBg.jpg';
import Card1 from '../assets/Hotel/Card1.png';

const Promotions = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTab, setSelectedTab] = useState("Promotions");
    const [promotionData, setPromotionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const slide = {
        bgImage: RedemptionBg,
        heading: "Redemption",
        subheading: "Your rewards, your way. Redeem now!"
    };

    const categories = ["All"];

    // Fetch promotions data
    useEffect(() => {
        fetchPromotions();
    }, [selectedCategory]); // Re-fetch when category changes

    const fetchPromotions = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Fetching promotions...');
            const response = await promotionAPI.getPromotions({ category: selectedCategory });
            
            if (response.success) {
                setPromotionData(response.data);
                console.log('✅ Promotions loaded successfully:', response.data);
                // toast.success(`${response.data.length} promotions loaded successfully!`);
            } else {
                setError('Failed to load promotions');
                console.error('❌ Failed to load promotions:', response.message);
                toast.error('Failed to load promotions from server.');
            }
        } catch (error) {
            setError('Network error occurred');
            console.error('❌ Network error:', error);
            toast.error('Network error occurred. Loading sample promotions.');
            
            // Fallback to static data if API fails
            setPromotionData([
                {
                    id: 1,
                    name: "Tissot Watch",
                    title: "Tissot T-Race MotoGP Quartz Chronograph (2025)",
                    currentPrice: 65000,
                    originalPrice: 85000,
                    points: 65000,
                    image: Card1,
                    category: "Luxury",
                    featured: true,
                    description: "Exclusive of all taxes EMI from ₹ 5851"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPromotions = selectedCategory === "All" 
        ? promotionData 
        : promotionData.filter(item => item.category === selectedCategory);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Helper function to truncate description
    const truncateDescription = (description, maxLength = 60) => {
        if (!description) return '';
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength).trim() + '...';
    };

    const renderTabContent = () => {
        switch(selectedTab) {
            case 'Redemptions':
                return <Redemptions />;
            case 'Encash':
                return <Encash />;
            default: // Promotions
                return (
                    <>
                        {/* Promotions Grid */}
                        <div className="px-4 py-8 sm:py-10 md:py-20 max-w-7xl mx-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F12]"></div>
                                    <span className="ml-3 text-gray-600">Loading promotions...</span>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20">
                                    <div className="text-red-500 mb-4">❌ {error}</div>
                                    <button 
                                        onClick={fetchPromotions}
                                        className="bg-[#FF4F12] text-white px-6 py-2 rounded-lg hover:bg-[#e63e0f]"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {filteredPromotions.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                                                item.featured ? "border-2 border-[#FF4F12]" : "border border-gray-200"
                                            }`}
                                        >
                                            {item.featured && (
                                                <div className="bg-[#FF4F12] text-white text-center py-2 text-sm font-semibold">
                                                    Featured
                                                </div>
                                            )}
                                            
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-64 object-cover"
                                                />
                                                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                                    {item.category}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-[#FF4F12] font-medium mb-3">
                                                    {item.title}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-4" title={item.description}>
                                                    {truncateDescription(item.description)}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600 text-sm">Current Price:</span>
                                                        <span className="text-lg font-bold text-gray-800">
                                                            {formatPrice(item.currentPrice)}
                                                        </span>
                                                    </div>
                                                    {item.originalPrice > item.currentPrice && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-500 text-sm">Original:</span>
                                                            <span className="text-sm text-gray-500 line-through">
                                                                {formatPrice(item.originalPrice)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600 text-sm">Points Required:</span>
                                                        <span className="text-lg font-bold text-[#FF4F12]">
                                                            ⭐ {item.points.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={`/promotion-detail/${item.id}`}
                                                    className="w-full bg-[#24293c] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1a1f2e] transition-colors duration-300 text-center block"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section
                className="relative min-h-[75vh] w-full text-white flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
                }}
            >
                <div className="text-center max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
                        {slide.heading}
                    </h1>
                    <div className="h-[2px] w-16 sm:w-50 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
                    <p className="text-lg sm:text-xl mt-4 opacity-90">
                        {slide.subheading}
                    </p>
                    <button className="mt-6 px-8 py-3 bg-[#FF4F12] text-white font-semibold rounded-lg hover:bg-[#e63e0f] transition-colors duration-300">
                        Read More
                    </button>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="w-full mt-10 px-4">
                <div className="flex justify-center">
                    <div className="flex bg-gray-100 rounded-full p-1 max-w-md">
                        {["Promotions", "Redemptions", "Encash"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                    selectedTab === tab
                                        ? "bg-[#FF4F12] text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

        </div>
    );
};

export default Promotions;
