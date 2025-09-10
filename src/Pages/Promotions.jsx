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
    const [selectedTab, setSelectedTab] = useState("Featured Product");
    const [promotionData, setPromotionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [memberData, setMemberData] = useState(() => {
        const stored = sessionStorage.getItem('memberData');
        return stored ? JSON.parse(stored) : null;
    });
    // Listen for updates to sessionStorage (in case TransactionStatuss updates it)
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'memberData') {
                setMemberData(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

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

    // Format price as INR with Indian comma separators
    const formatPrice = (price) => {
        if (typeof price !== 'number') return price;
        return price.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Helper function to truncate description
    const truncateDescription = (description, maxLength = 60) => {
        if (!description) return '';
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength).trim() + '...';
    };

    const renderTabContent = () => {
        switch(selectedTab) {
            case 'Redemption Market Place':
                return <Redemptions />;
            case 'Encash': {
                const memberId = localStorage.getItem('Loyalty_Member_Unique_Id__c');
                
                return <Encash memberData={memberId ? memberData : []} />;
            }
            default: // Promotions
                return (
                    <>
                        {/* Promotions Grid */}
                        <div className="px-4 py-8 max-w-7xl mx-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9461c]"></div>
                                    <span className="ml-3 text-gray-600">Loading promotions...</span>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20">
                                    <div className="text-red-500 mb-4">❌ {error}</div>
                                    <button 
                                        onClick={fetchPromotions}
                                        className="bg-[#f9461c] text-white px-6 py-2 rounded-lg hover:bg-[#e63e0f]"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredPromotions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col justify-between bg-white rounded-[12px] overflow-hidden min-h-[440px] transition-all duration-300"
                                            style={{ boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)', borderBottom: '2px solid #f9461c' }}
                                        >
                                            {/* Watch Image */}
                                            <div className="flex justify-center items-end bg-white pt-8 pb-2 px-4" style={{minHeight: 230}}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-56 object-contain"
                                                    style={{maxHeight: '200px'}}
                                                />
                                            </div>
                                            {/* Card Content */}
                                            <div className="flex flex-col flex-1 px-8 pb-8 pt-2">
                                                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                                {item.originalPrice > item.currentPrice && (
                                                    <div className="text-base text-gray-400 font-semibold line-through mb-1" >
                                                        {formatPrice(item.originalPrice)}
                                                    </div>
                                                )}
                                                {/* <div className="text-2xl text-[#B3B3B3] font-bold mb-2" style={{textDecoration: 'line-through', fontSize:'16px'}}>{formatPrice(item.currentPrice)}</div> */}
                                                {/* Redeem Row */}
                                                <div style={{fontSize:'14px', fontWeight:'bold'}}>
                                                    <span className="text-gray-500 mr-2" >Redeem using</span>
                                                    <span className="flex items-center text-[#000]">
                                                        <img
                                                            src="/redeemStar.png"
                                                            alt="star"
                                                            className="mr-1"
                                                            style={{ width: 24, height: 24, display: 'inline-block' }}
                                                        />
                                                        {typeof item.points === 'number' ? item.points.toLocaleString('en-IN') : item.points}
                                                    </span>
                                                </div>
                                                {/* View Details Button */}
                                                <div className="flex justify-end mt-auto">
                                                    <Link
                                                        to={`/promotion-detail/${item.id}`}
                                                        className="bg-[#24293c] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#1a1f2e] transition-colors duration-300 shadow-none"
                                                        style={{minWidth: 170, textAlign: 'center'}}
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
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
                    <div className="h-[2px] w-16 sm:w-50 bg-[#f9461c] my-3 sm:my-4 mx-auto" />
                    <p className="text-lg sm:text-xl mt-4 opacity-90">
                        {slide.subheading}
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="w-full mt-10 px-4">
                <div className="flex justify-center">
                    <div className="flex bg-gray-100 rounded-full w-4/5 mx-auto" style={{padding: '4px'}}>
                        {["Featured Product", "Encash"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`flex-1 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                    selectedTab === tab
                                        ? "bg-[#f9461c] text-white shadow-md"
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
