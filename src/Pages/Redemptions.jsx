import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionAPI from '../services/promotionAPI';

const Redemptions = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [redemptionCategories, setRedemptionCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch redemption categories on component mount
    useEffect(() => {
        fetchRedemptions();
    }, [selectedCategory]);

    const fetchRedemptions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await promotionAPI.getRedemptions(selectedCategory);
            
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
                image: '/src/assets/Hotel/hotel1.jpg',
                category: 'Travel'
            },
            {
                id: 2,
                title: 'F&B',
                subtitle: 'Unlock Exclusive Stays',
                image: '/src/assets/Hotel/hotel2.jpg',
                category: 'Food'
            },
            {
                id: 3,
                title: 'Tickets',
                subtitle: 'Unlock Exclusive Stays',
                image: '/src/assets/Hotel/hotel3.jpg',
                category: 'Entertainment'
            },
            {
                id: 4,
                title: 'Shopping',
                subtitle: 'Unlock Exclusive Stays',
                image: '/src/assets/Hotel/Card1.png',
                category: 'Shopping'
            },
            {
                id: 5,
                title: 'Experience',
                subtitle: 'Unlock Exclusive Stays',
                image: '/src/assets/Hotel/Card2.png',
                category: 'Experience'
            },
            {
                id: 6,
                title: 'Services',
                subtitle: 'Unlock Exclusive Stays',
                image: '/src/assets/Hotel/Card3.png',
                category: 'Services'
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
                navigate('/hotels-redemption');
                break;
            case 'F&B':
                // Navigate to F&B section or create a specific F&B page
                navigate('/hotels-redemption'); // For now, redirect to hotels
                break;
            case 'Tickets':
                // Navigate to tickets section
                navigate('/hotels-redemption'); // For now, redirect to hotels
                break;
            default:
                // For other categories, you can add more specific navigation
                console.log(`Category ${categoryTitle} clicked`);
        }
    };

    const categories = ['All', 'Travel', 'Food', 'Entertainment', 'Shopping', 'Experience', 'Services'];

    const filteredRedemptions = selectedCategory === 'All' 
        ? redemptionCategories 
        : redemptionCategories.filter(item => item.category === selectedCategory);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF4F12] mx-auto mb-4"></div>
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
                        className="bg-[#FF4F12] text-white px-6 py-2 rounded-lg hover:bg-[#e03d12]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Category Filters */}
            <div className="flex justify-center mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedCategory === category
                                    ? "bg-[#FF4F12] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Redemption Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRedemptions.map((item) => (
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
                                    onClick={() => handleCategoryClick(item.title)}
                                    className="bg-[#24293c] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1a1f2e] transition-colors duration-300"
                                >
                                    View Rewards
                                </button>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#FF4F12] text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Information */}
            <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">How Redemptions Work</h3>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#FF4F12] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Choose Category</h4>
                        <p className="text-gray-600 text-sm">Select from various categories like Hotels, F&B, Tickets, and more</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#FF4F12] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">View Rewards</h4>
                        <p className="text-gray-600 text-sm">Browse available rewards and check point requirements</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#FF4F12] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">3</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Redeem Points</h4>
                        <p className="text-gray-600 text-sm">Use your points to unlock exclusive experiences and rewards</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Redemptions;
