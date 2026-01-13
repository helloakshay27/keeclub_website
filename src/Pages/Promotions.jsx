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
                        {/* No Offers Message */}
                        <div className="px-4 py-8 max-w-7xl mx-auto">
                            <div className="flex justify-center items-center py-20">
                                <div className="text-center">
                                    <p className="text-2xl font-semibold text-gray-600">Currently no offer available</p>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="w-full">
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
                    <div className="flex bg-gray-100 rounded-full w-4/5 mx-auto" style={{ padding: '4px' }}>
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

            {renderTabContent()}

        </div>
    );
};

export default Promotions;
