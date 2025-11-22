import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import promotionAPI from '../services/promotionAPI';

const RedeemPoints = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [pointCode, setPointCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);
    const [existingAddresses, setExistingAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        contactNumber: '', // Initialize empty, will be set in useEffect
        pinCode: '',
        city: '',
        state: 'Select State',
        landmark: '',
        fullAddress: '',
        addressLineTwo: '',
        addressLineThree: '',
        addressType: 'home',
        email: ''
    });

    // Check authentication and fetch addresses on component mount
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        // Check if user is properly authenticated
        if (!authToken || authToken === 'null') {
            toast.error('Please login to access this page');
            navigate('/login');
            return;
        }
        
        // Set phone number from localStorage
        const salesforceMobile = localStorage.getItem('salesforce_mobile');
        if (salesforceMobile) {
            setAddressForm(prev => ({
                ...prev,
                contactNumber: salesforceMobile
            }));
        }
        
        fetchUserAddresses();
    }, [navigate]);

    const fetchUserAddresses = async () => {
        setAddressLoading(true);
        try {
            const response = await promotionAPI.getUserAddresses();
            
            if (response.success && response.data.length > 0) {
                setExistingAddresses(response.data);
                
                // If addresses exist, skip to order confirmation
                const defaultAddress = response.data.find(addr => addr.isDefault) || response.data[0];
                if (defaultAddress) {
                    // Directly navigate to order confirmation with existing address
                    navigate('/order-confirmation', {
                        state: {
                            product: product,
                            selectedAddress: defaultAddress,
                            pointCode: pointCode
                        }
                    });
                    return;
                }
            } else {
                // No addresses found, show address form
                setShowAddressForm(true);
            }
        } catch (error) {
            console.error('❌ Error fetching addresses:', error);
            setShowAddressForm(true);
        } finally {
            setAddressLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setAddressForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveAndContinue = async () => {
        // Validate required fields
        const requiredFields = ['name', 'contactNumber', 'pinCode', 'city', 'fullAddress', 'email'];
        const missingFields = requiredFields.filter(field => !addressForm[field]);
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (addressForm.state === 'Select State') {
            toast.error('Please select a state');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(addressForm.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            
            // Create address via API
            const addressResponse = await promotionAPI.createAddress(addressForm);
            
            if (addressResponse.success) {
                toast.success('Address saved successfully! Redirecting to order confirmation...');
                
                // Extract address data from the new response format
                const createdAddress = addressResponse.data.address || addressResponse.data;
                
                // Navigate to order confirmation with the actual API response address data
                navigate('/order-confirmation', {
                    state: {
                        product: product,
                        addressForm: null, // Don't pass form data, use API response instead
                        addressFromAPI: createdAddress, // Pass the actual API response
                        pointCode: pointCode,
                        addressId: createdAddress.id
                    }
                });
            } else {
                toast.error('Failed to save address. Please try again.');
            }
        } catch (error) {
            console.error('❌ Error creating address:', error);
            toast.error('An error occurred while saving the address. Please try again.');
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

    // Show loading state while checking for existing addresses
    if (addressLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking your addresses...</p>
                </div>
            </div>
        );
    }

    // If not showing address form (addresses exist), this component won't render
    // because user is redirected to order-confirmation
    if (!showAddressForm) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 pt-30">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={addressForm.contactNumber}
                                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                            disabled={true} // Disable the phone input
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615] bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Email and Address Line 1 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            placeholder="Enter Email Address"
                                            value={addressForm.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address (Line 1)</label>
                                        <input
                                            type="text"
                                            placeholder="Address (Line 1)"
                                            value={addressForm.fullAddress}
                                            onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                </div>

                                {/* Address Line 2 and Address Line 3 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                        <input
                                            type="text"
                                            placeholder="Address Line 2"
                                            value={addressForm.addressLineTwo}
                                            onChange={(e) => handleInputChange('addressLineTwo', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
                                        <input
                                            type="text"
                                            placeholder="Address Line 3"
                                            value={addressForm.addressLineThree}
                                            onChange={(e) => handleInputChange('addressLineThree', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div>
                                </div>

                                {/* Pin Code and City */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Pin Code"
                                            value={addressForm.pinCode}
                                            onChange={(e) => handleInputChange('pinCode', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={addressForm.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* State and Landmark */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={addressForm.state === 'Select State' ? '' : addressForm.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                            required
                                            placeholder="Enter State"
                                        />
                                    </div>
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                                        <input
                                            type="text"
                                            placeholder="Landmark"
                                            value={addressForm.landmark}
                                            onChange={(e) => handleInputChange('landmark', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa4615]"
                                        />
                                    </div> */}
                                </div>

                                {/* Address Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address type</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="home"
                                                checked={addressForm.addressType === 'home'}
                                                onChange={(e) => handleInputChange('addressType', e.target.value)}
                                                className="w-4 h-4 text-[#fa4615] focus:ring-[#fa4615] mr-2"
                                            />
                                            <span className="text-gray-700">Home (All days delivery)</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="work"
                                                checked={addressForm.addressType === 'work'}
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
                    {/* <div>
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
                    </div> */}
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
