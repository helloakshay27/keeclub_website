import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, orderId, userDetails } = location.state || {};

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!product || !orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-800 mb-4">Order not found</h1>
                    <button 
                        onClick={() => navigate('/promotions')}
                        className="px-6 py-3 bg-[#FF4F12] text-white rounded-lg hover:bg-[#e63e0f]"
                    >
                        Go to Promotions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Indicator */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#FF4F12] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                ✓
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-[#FF4F12]"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#FF4F12] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                ✓
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">Bonus Offer</span>
                        </div>
                        <div className="w-16 h-1 bg-[#FF4F12]"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#FF4F12] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                ✓
                            </div>
                            <span className="ml-2 text-sm font-medium text-[#FF4F12]">Confirmation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            <div className="bg-[#24293c] text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-6">
                        <CheckCircle size={80} className="text-[#FF4F12] mx-auto" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Thank You {userDetails?.firstName}!
                    </h1>
                    <p className="text-xl">
                        Your Order #{orderId} is completed successfully
                    </p>
                </div>
            </div>

            {/* Order Details */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Confirmation */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Order is confirmed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We've accepted your order, and we're getting it ready. A Confirmation 
                            mail has been sent to <span className="font-medium">asdf@gmail.com</span>
                        </p>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Customer details
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p className="font-medium text-gray-800">
                                    {userDetails?.firstName} {userDetails?.lastName}
                                </p>
                                <p>{userDetails?.phone}</p>
                                <p className="text-sm">
                                    {userDetails?.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Order Details
                        </h2>

                        <div className="flex items-start space-x-4 mb-6">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-[#FF4F12] mb-2">{product.title}</p>
                                <p className="text-xs text-gray-600">
                                    {product.id}: {product.specifications?.model || 'TT1.417.27.081.00'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price (1 Item)</span>
                                <span className="font-medium">{formatPrice(product.currentPrice)}</span>
                            </div>
                            
                            <div className="flex justify-between text-[#FF4F12]">
                                <span>Redeemed Points</span>
                                <span className="font-medium">⭐ {product.points?.toLocaleString()}</span>
                            </div>
                            
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Payable</span>
                                    <span className="text-green-600">₹ 0.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 text-center space-y-4">
                    <button
                        onClick={() => navigate(`/track-order/${orderId}`, { 
                            state: { product, orderId, userDetails } 
                        })}
                        className="inline-flex items-center px-8 py-3 bg-[#FF4F12] text-white font-semibold rounded-lg hover:bg-[#e63e0f] transition-colors duration-300 mr-4"
                    >
                        <Package className="mr-2" size={20} />
                        Track Order
                    </button>
                    
                    <button
                        onClick={() => navigate('/promotions')}
                        className="inline-flex items-center px-8 py-3 border-2 border-[#FF4F12] text-[#FF4F12] font-semibold rounded-lg hover:bg-[#FF4F12] hover:text-white transition-colors duration-300"
                    >
                        <Home className="mr-2" size={20} />
                        Continue Shopping
                    </button>
                </div>

                {/* Delivery Information */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                        <Truck className="text-blue-600 mr-3 mt-1" size={24} />
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Delivery Information
                            </h3>
                            <p className="text-blue-700 text-sm">
                                Your order will be processed within 2-3 business days. 
                                You'll receive tracking information via email once your order ships. 
                                Expected delivery: 5-7 business days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
