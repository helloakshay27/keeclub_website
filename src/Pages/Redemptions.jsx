import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionAPI from '../services/promotionAPI';
import hotel1 from '../assets/Hotel/hotel1.jpg';
import hotel2 from '../assets/Hotel/hotel2.jpg';
import hotel3 from '../assets/Hotel/hotel3.jpg';

const Redemptions = () => {
    const [redemptionCategories, setRedemptionCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch redemption categories on component mount
    useEffect(() => {
        fetchRedemptions();
    }, []);

    const fetchRedemptions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await promotionAPI.getRedemptions();
            
            if (response.success) {
                setRedemptionCategories(response.data);
            } else {
                setError('Failed to load redemptions');
                // Fallback to static data
                setRedemptionCategories(getStaticRedemptions());
            }
        } catch (err) {
            console.error('Error fetching redemptions:', err);
            setError('Failed to load redemptions');
            // Fallback to static data
            setRedemptionCategories(getStaticRedemptions());
        } finally {
            setLoading(false);
        }
    };

    const getStaticRedemptions = () => {
        return [
            {
                id: 1,
                title: 'Hotels',
                subtitle: 'Unlock Exclusive Stays',
                image: hotel1,
                category: 'Travel'
            },
            {
                id: 2,
                title: 'F&B',
                subtitle: 'Savor Culinary Delights',
                image: hotel2,
                category: 'Food'
            },
            {
                id: 3,
                title: 'Tickets',
                subtitle: 'Experience Entertainment',
                image: hotel3,
                category: 'Entertainment'
            }
        ];
    };

    const handleCategoryClick = (categoryTitle) => {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('authToken');
        const memberId = localStorage.getItem('member_id');
        
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        // Navigate based on category
        switch(categoryTitle) {
            case 'Hotels':
                navigate('/dashboard/hotel-details');
                break;
            case 'F&B':
                // Navigate to F&B section or create a specific F&B page
                navigate(''); // For now, redirect to hotels
                break;
            case 'Tickets':
                // Navigate to tickets section
                navigate(''); // For now, redirect to hotels
                break;
            default:
                // For other categories, you can add more specific navigation
                console.log(`Category ${categoryTitle} clicked`);
        }
    };

    // Only show Hotels, F&B, and Tickets - no category filtering needed
    const displayRedemptions = redemptionCategories.length > 0 ? redemptionCategories : getStaticRedemptions();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f9461c] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading redemptions...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h3 className="text-xl text-red-600 mb-2">Error Loading Redemptions</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button 
                        onClick={fetchRedemptions}
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
            {/* Additional Information */}
            <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">How Redemptions Work</h3>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#f9461c] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Choose Category</h4>
                        <p className="text-gray-600 text-sm">Select from various categories like Hotels, F&B, Tickets, and more</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#f9461c] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">View Rewards</h4>
                        <p className="text-gray-600 text-sm">Browse available rewards and check point requirements</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#f9461c] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">3</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Redeem Points</h4>
                        <p className="text-gray-600 text-sm">Use your points to unlock exclusive experiences and rewards</p>
                    </div>
                </div>
            </div>
            {/* Redemption Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayRedemptions.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleCategoryClick(item.title)}
                        className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                    >
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* Content Overlay */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                                <p className="text-sm opacity-90">{item.subtitle}</p>
                            </div>

                            {/* View Rewards Button */}
                            <div className="absolute bottom-4 right-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCategoryClick(item.title);
                                    }}
                                    className="bg-[#24293c] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1a1f2e] transition-colors duration-300"
                                >
                                    View Rewards
                                </button>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#f9461c] text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Redemptions;
