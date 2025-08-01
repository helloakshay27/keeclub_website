import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import promotionAPI from '../services/promotionAPI';

const RedeemPoints = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [pointCode, setPointCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: '',
        contactNumber: '',
        pinCode: '',
        city: '',
        state: 'Select State',
        landmark: '',
        fullAddress: '',
        addressType: 'Home'
    });

    const handleInputChange = (field, value) => {
        setAddressForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveAndContinue = async () => {
        try {
            setLoading(true);
            
            // Create order via API
            const orderData = {
                product: product,
                deliveryAddress: addressForm,
                orderType: 'product_redemption'
            };
            
            const response = await promotionAPI.createOrder(orderData);
            
            if (response.success) {
                // Navigate to order confirmation with order details
                navigate('/order-confirmation', {
                    state: {
                        product: product,
                        addressForm: addressForm,
                        pointCode: pointCode,
                        orderDetails: response.data
                    }
                });
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No product selected</h2>
                    <button 
                        onClick={() => navigate('/promotions')}
                        className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e03d12]"
                    >
                        Back to Promotions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column - Product Details */}
                    <div className="space-y-8">
                        {/* Product Section */}
                        <div className="flex items-start space-x-6">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                    src={product.images?.[0] || product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
                                <p className="text-[#fa4615] text-lg mb-3">{product.title}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current MRP</span>
                                        <span className="font-bold">₹ {product.currentPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <p>*Inclusive of all taxes</p>
                                        <p>EMI from ₹ 5851</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Address Section */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Add Address</h2>
                            <div className="space-y-4">
                                {/* Name and Contact Number */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Name"
                                            value={addressForm.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Contact Number"
                                            value={addressForm.contactNumber}
                                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                </div>

                                {/* Pin Code and City */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                        <input
                                            type="text"
                                            placeholder="Pin Code"
                                            value={addressForm.pinCode}
                                            onChange={(e) => handleInputChange('pinCode', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={addressForm.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                </div>

                                {/* State and Landmark */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <select
                                            value={addressForm.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        >
                                            <option>Select State</option>
                                            <option>Maharashtra</option>
                                            <option>Delhi</option>
                                            <option>Karnataka</option>
                                            <option>Tamil Nadu</option>
                                            <option>Gujarat</option>
                                            <option>Rajasthan</option>
                                            <option>West Bengal</option>
                                            <option>Uttar Pradesh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                                        <input
                                            type="text"
                                            placeholder="Landmark"
                                            value={addressForm.landmark}
                                            onChange={(e) => handleInputChange('landmark', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                </div>

                                {/* Full Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea
                                        placeholder="Full Address"
                                        value={addressForm.fullAddress}
                                        onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                    />
                                </div>

                                {/* Address Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address type</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="Home"
                                                checked={addressForm.addressType === 'Home'}
                                                onChange={(e) => handleInputChange('addressType', e.target.value)}
                                                className="w-4 h-4 text-[#fa4615] focus:ring-[#fa4615] mr-2"
                                            />
                                            <span className="text-gray-700">Home (All days delivery)</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="Work"
                                                checked={addressForm.addressType === 'Work'}
                                                onChange={(e) => handleInputChange('addressType', e.target.value)}
                                                className="w-4 h-4 text-[#fa4615] focus:ring-[#fa4615] mr-2"
                                            />
                                            <span className="text-gray-700">Work (delivery between 10 am to 5pm)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Redeem Points */}
                    <div>
                        <div className="bg-gray-50 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">Redeem Your Points</h2>
                            <p className="text-gray-600 mb-6">Choose from exclusive rewards curated just for you</p>
                            
                            <div className="mb-6">
                                <span className="text-sm text-gray-600">Your Points Balance: </span>
                                <span className="text-orange-500 font-bold flex items-center">
                                    <span className="text-orange-500 mr-2">🔹</span>
                                    You have {product.points?.toLocaleString() || '65,000'} Points
                                </span>
                            </div>

                            <div className="flex space-x-2 mb-8">
                                <input
                                    type="text"
                                    placeholder="Enter Point Code"
                                    value={pointCode}
                                    onChange={(e) => setPointCode(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                />
                                <button className="bg-[#24293c] text-white px-6 py-3 rounded font-semibold hover:bg-[#1a1f2e]">
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save & Continue Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleSaveAndContinue}
                        disabled={loading}
                        className={`px-16 py-4 rounded-lg text-lg font-semibold transition-colors ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#24293c] hover:bg-[#1a1f2e]'
                        } text-white`}
                    >
                        {loading ? 'Creating Order...' : 'Save & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RedeemPoints;
