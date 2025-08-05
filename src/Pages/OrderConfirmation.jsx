import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import promotionAPI from '../services/promotionAPI';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { product, selectedAddress, addressForm, pointCode, addressId } = location.state || {};
    
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication and initialize address data on component mount
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const memberId = localStorage.getItem('member_id');
        
        // Check if user is properly authenticated
        if (!authToken || !memberId || authToken === 'null' || memberId === 'null') {
            console.log('🔐 User not authenticated, redirecting to login');
            toast.error('Please login to access this page');
            navigate('/login');
            return;
        }
        
        console.log('🔐 User authenticated, proceeding to initialize address data');
        initializeAddressData();
    }, [navigate]);

    const initializeAddressData = async () => {
        try {
            setLoading(true);
            
            // If we have selectedAddress (from existing addresses), use it
            if (selectedAddress) {
                setDeliveryAddress({
                    id: selectedAddress.id,
                    name: selectedAddress.contactPerson,
                    type: selectedAddress.addressType || 'home',
                    phone: selectedAddress.mobile,
                    email: selectedAddress.email,
                    address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pinCode}`,
                    fullDetails: selectedAddress
                });
                console.log('✅ Using existing selected address:', selectedAddress);
            }
            // If we have addressForm (newly created), use it
            else if (addressForm) {
                setDeliveryAddress({
                    id: addressId,
                    name: addressForm.name,
                    type: addressForm.addressType || 'home',
                    phone: addressForm.contactNumber,
                    email: addressForm.email,
                    address: `${addressForm.fullAddress}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pinCode}`,
                    fullDetails: addressForm
                });
                console.log('✅ Using newly created address:', addressForm);
            }
            // Fallback: fetch addresses from API
            else {
                console.log('🔄 No address provided, fetching from API...');
                const response = await promotionAPI.getUserAddresses();
                
                if (response.success && response.data.length > 0) {
                    const defaultAddress = response.data.find(addr => addr.isDefault) || response.data[0];
                    setDeliveryAddress({
                        id: defaultAddress.id,
                        name: defaultAddress.contactPerson,
                        type: defaultAddress.addressType || 'home',
                        phone: defaultAddress.mobile,
                        email: defaultAddress.email,
                        address: `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pinCode}`,
                        fullDetails: defaultAddress
                    });
                    console.log('✅ Fetched address from API:', defaultAddress);
                } else {
                    setError('No delivery address found. Please add an address.');
                }
            }
        } catch (error) {
            console.error('❌ Error initializing address:', error);
            setError('Failed to load address details.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        try {
            setLoading(true);
            
            // Validate required data
            if (!deliveryAddress.id) {
                toast.error('Address ID is required. Please ensure you have a saved address.');
                return;
            }
            
            if (!product.id) {
                toast.error('Product ID is required. Please try again.');
                return;
            }
            
            // Create order via real API
            const orderData = {
                addressId: deliveryAddress.id,
                product: product,
                deliveryAddress: deliveryAddress
            };
            
            console.log('📦 Creating order with data:', orderData);
            toast.info('Creating your order...');
            const response = await promotionAPI.createOrder(orderData);
            
            if (response.success) {
                console.log('✅ Order created successfully:', response.data);
                toast.success(`Order #${response.data.order_number} created successfully!`);
                
                // Navigate to order success with real order details
                navigate('/order-success', {
                    state: {
                        orderId: response.data.order_id,
                        orderNumber: response.data.order_number,
                        product,
                        deliveryAddress,
                        orderDetails: response.data,
                        loyaltyPointsUsed: response.data.loyalty_points_redeemed,
                        remainingPoints: response.data.remaining_loyalty_points,
                        totalAmount: response.data.total_amount,
                        trackingNumber: response.data.tracking_number
                    }
                });
            } else {
                console.error('❌ Order creation failed:', response.message);
                toast.error(`Failed to create order: ${response.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('❌ Error creating order:', error);
            toast.error('An error occurred while creating the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">No product selected</h2>
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

    // Show loading state while fetching address
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !deliveryAddress) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
                    <p className="text-gray-600 mb-4">{error || 'No delivery address found'}</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Please ensure you have a valid address saved. 
                            The address ID is required for order creation.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <button 
                            onClick={() => navigate('/redeem-points', { state: { product } })}
                            className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e03d12]"
                        >
                            Add Address
                        </button>
                        <button 
                            onClick={() => navigate('/promotions')}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                            Back to Promotions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-30">
            <div className="w-full px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Column - Order Summary & Delivery Address */}
                        <div className="space-y-8">
                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                                    <div className="flex items-start space-x-6">
                                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={product.images?.[0] || product.image || product.primary_image} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-1">{product.brand || product.name}</h3>
                                            <p className="text-[#fa4615] text-base mb-3">{product.title || product.description}</p>
                                        </div>
                                    </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Delivery Address</h2>
                                    {/* <button 
                                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <Edit size={20} />
                                    </button> */}
                                </div>
                                
                                {isEditingAddress ? (
                                    <div className="border rounded-lg p-4 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={deliveryAddress.name}
                                                onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                                                className="border rounded px-3 py-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Phone"
                                                value={deliveryAddress.phone}
                                                onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                                                className="border rounded px-3 py-2"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Full Address"
                                            value={deliveryAddress.address}
                                            onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                                            className="w-full border rounded px-3 py-2 h-20"
                                        />
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="addressType" 
                                                    value="Home"
                                                    checked={deliveryAddress.type === 'Home'}
                                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, type: e.target.value})}
                                                    className="mr-2"
                                                />
                                                Home (All day delivery)
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="addressType" 
                                                    value="Work"
                                                    checked={deliveryAddress.type === 'Work'}
                                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, type: e.target.value})}
                                                    className="mr-2"
                                                />
                                                Work (delivery between 10 am to 5pm)
                                            </label>
                                        </div>
                                        <button
                                            onClick={() => setIsEditingAddress(false)}
                                            className="bg-[#24293c] text-white px-6 py-2 rounded"
                                        >
                                            Save & Continue
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-4 h-4 rounded-full bg-green-500 mt-1 mr-4"></div>
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="font-medium text-lg">{deliveryAddress.name}</span>
                                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                                        {deliveryAddress.type}
                                                    </span>
                                                    <span className="font-medium text-lg">{deliveryAddress.phone}</span>
                                                </div>
                                                {deliveryAddress.email && (
                                                    <div className="text-gray-600 text-sm mb-1">
                                                        Email: {deliveryAddress.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 ml-8 leading-relaxed">{deliveryAddress.address}</p>
                                        {/* {deliveryAddress.id && (
                                            <p className="text-xs text-gray-500 ml-8 mt-2">Address ID: {deliveryAddress.id}</p>
                                        )} */}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Price Details & Redeem Points */}
                        <div className="bg-gray-50 rounded-lg p-6 space-y-8">
                            {/* Price Details */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">Price details</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-lg">
                                        <span>Price (1 Item)</span>
                                        <span>₹ {(product.currentPrice || product.points || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span> Points To Redeem</span>
                                        <span className="text-orange-500 flex items-center">
                                            <img
                                src="/redeemStar.png"
                                alt="star"
                                className="mr-1"
                                style={{ width: 24, height: 24, display: 'inline-block' }}
                              />
                                            {(product.loyalty_points_required || product.points || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {product.originalPrice && product.originalPrice > (product.currentPrice || 0) && (
                                        <div className="flex justify-between text-lg text-green-600">
                                            <span>Savings</span>
                                            <span>₹ {(product.originalPrice - (product.currentPrice || 0)).toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <hr className="border-gray-300" />
                                    <div className="flex justify-between font-semibold text-xl">
                                        <span>Total Payable</span>
                                        <span className="text-green-600">₹ 0.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Redeem Your Points Section */}
                            {/* <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Redeem Your Points</h3>
                                <p className="text-gray-600 mb-4">Choose from exclusive rewards curated just for you</p>
                                <div className="mb-4">
                                    <span className="text-sm text-gray-600">Your Points Balance: </span>
                                    <span className="text-orange-500 font-semibold">
                                        🔹 You have {(product.loyalty_points_required || product.points || 65000).toLocaleString()} Points
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Point Code"
                                        defaultValue={pointCode || ''}
                                        className="flex-1 border border-gray-300 rounded px-4 py-3"
                                    />
                                    <button className="bg-[#24293c] text-white px-6 py-3 rounded font-semibold hover:bg-[#1a1f2e] disabled:opacity-50">
                                        Redeem
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleConfirmOrder}
                            disabled={loading}
                            className={`px-16 py-4 rounded-lg text-lg font-semibold transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#24293c] hover:bg-[#1a1f2e]'
                            } text-white`}
                        >
                            {loading ? 'Processing Order...' : 'Confirm Order'}
                        </button>
                        
                        {/* Order Summary Info */}
                        <div className="mt-6 text-sm text-gray-600">
                            <p>By confirming, you agree to redeem {(product.loyalty_points_required || product.points || 0).toLocaleString('en-IN')} points for this product.</p>
                            <p>Estimated delivery: 7-10 business days</p>
                        </div>
                        
                        {/* Debug Info for Development */}
                        {/* <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
                            <p><strong>Debug Info:</strong></p>
                            <p>Product ID: {product.id || 'Missing'}</p>
                            <p>Address ID: {deliveryAddress?.id || 'Missing'}</p>
                            <p>Auth Token: {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
