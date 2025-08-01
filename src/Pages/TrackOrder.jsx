import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import promotionAPI from '../services/promotionAPI';

const TrackOrder = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { product, userDetails } = location.state || {};
    
    const [currentStatus, setCurrentStatus] = useState(1);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await promotionAPI.trackOrder(orderId);
            
            if (response.success) {
                setOrderData(response.data);
                // Determine current status from API response
                const statusMap = {
                    'confirmed': 1,
                    'processing': 2,
                    'shipped': 3,
                    'in_transit': 3,
                    'delivered': 4
                };
                setCurrentStatus(statusMap[response.data.status] || 1);
            } else {
                setError('Failed to fetch order details');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const orderStatuses = orderData?.updates ? orderData.updates.map((update, index) => ({
        id: index + 1,
        title: update.status,
        description: update.description,
        icon: [CheckCircle, Package, Truck, CheckCircle][index] || Clock,
        completed: true,
        timestamp: update.date
    })) : [
        {
            id: 1,
            title: "Order Confirmed",
            description: "Your order has been confirmed and is being processed",
            icon: CheckCircle,
            completed: currentStatus >= 1,
            timestamp: "2 Aug 2025, 10:30 AM"
        },
        {
            id: 2,
            title: "Order Processed",
            description: "Your order has been processed and is ready for dispatch",
            icon: Package,
            completed: currentStatus >= 2,
            timestamp: currentStatus >= 2 ? "2 Aug 2025, 2:45 PM" : ""
        },
        {
            id: 3,
            title: "Order Shipped",
            description: "Your order has been shipped and is on the way",
            icon: Truck,
            completed: currentStatus >= 3,
            timestamp: currentStatus >= 3 ? "3 Aug 2025, 9:15 AM" : ""
        },
        {
            id: 4,
            title: "Order Delivered",
            description: "Your order has been delivered successfully",
            icon: CheckCircle,
            completed: currentStatus >= 4,
            timestamp: currentStatus >= 4 ? "5 Aug 2025, 11:30 AM" : ""
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF4F12] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-red-600 mb-4">{error}</h1>
                    <div className="space-x-4">
                        <button 
                            onClick={fetchOrderDetails}
                            className="px-6 py-3 bg-[#FF4F12] text-white rounded-lg hover:bg-[#e63e0f]"
                        >
                            Retry
                        </button>
                        <button 
                            onClick={() => navigate('/promotions')}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Go to Promotions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-800 mb-4">Invalid Order ID</h1>
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
        <div className="min-h-screen bg-gray-50 py-12 pt-30">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Track Your Order
                            </h1>
                            <p className="text-gray-600">Order ID: #{orderId}</p>
                        </div>
                        <button
                            onClick={() => navigate('/promotions')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Back to Promotions
                        </button>
                    </div>
                    
                    {product && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-[#FF4F12]">{product.title}</p>
                                <p className="text-sm text-gray-600">
                                    Points Used: ⭐ {product.points?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Progress */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                Order Progress
                            </h2>
                            
                            <div className="relative">
                                {orderStatuses.map((status, index) => {
                                    const Icon = status.icon;
                                    const isLast = index === orderStatuses.length - 1;
                                    
                                    return (
                                        <div key={status.id} className="relative flex items-start pb-8">
                                            {/* Connector Line */}
                                            {!isLast && (
                                                <div 
                                                    className={`absolute left-6 top-12 w-0.5 h-16 ${
                                                        status.completed ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}
                                                />
                                            )}
                                            
                                            {/* Status Icon */}
                                            <div 
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    status.completed 
                                                        ? 'bg-green-500 text-white' 
                                                        : currentStatus === status.id
                                                        ? 'bg-[#FF4F12] text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                                }`}
                                            >
                                                {status.completed ? (
                                                    <CheckCircle size={24} />
                                                ) : currentStatus === status.id ? (
                                                    <Clock size={24} />
                                                ) : (
                                                    <Icon size={24} />
                                                )}
                                            </div>
                                            
                                            {/* Status Content */}
                                            <div className="ml-4 flex-1">
                                                <h3 className={`font-semibold ${
                                                    status.completed ? 'text-green-700' : 'text-gray-800'
                                                }`}>
                                                    {status.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    {status.description}
                                                </p>
                                                {status.timestamp && (
                                                    <p className="text-xs text-gray-500">
                                                        {status.timestamp}
                                                    </p>
                                                )}
                                                
                                                {currentStatus === status.id && !status.completed && (
                                                    <div className="mt-2">
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF4F12] mr-2"></div>
                                                            <span className="text-sm text-[#FF4F12] font-medium">
                                                                In Progress...
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Delivery Information */}
                        {currentStatus >= 3 && (
                            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Delivery Information
                                </h2>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <Truck className="text-blue-600 mr-2" size={20} />
                                        <span className="font-medium text-blue-800">
                                            Out for Delivery
                                        </span>
                                    </div>
                                    <p className="text-blue-700 text-sm mb-2">
                                        Your package is out for delivery and will arrive today between 10:00 AM - 6:00 PM
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Tracking ID: KCL{orderId}2025
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="mr-2 text-[#FF4F12]" size={20} />
                                Delivery Address
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-800">
                                    {userDetails?.firstName} {userDetails?.lastName}
                                </p>
                                <p>{userDetails?.address || "408, Floor no.4, Sumer Kendra, Worli West, Mumbai, Maharashtra-400030"}</p>
                                <p className="flex items-center mt-2">
                                    <Phone size={14} className="mr-1" />
                                    {userDetails?.phone || "9890887363"}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        {product && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Item Price</span>
                                        <span>{formatPrice(product.currentPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#FF4F12]">
                                        <span>Points Used</span>
                                        <span>⭐ {product.points?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-semibold">
                                            <span>Total Paid</span>
                                            <span className="text-green-600">₹ 0.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Help & Support */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Need Help?
                            </h3>
                            <div className="space-y-3 text-sm">
                                <button className="w-full text-left text-[#FF4F12] hover:underline">
                                    Contact Customer Support
                                </button>
                                <button className="w-full text-left text-[#FF4F12] hover:underline">
                                    Report an Issue
                                </button>
                                <button className="w-full text-left text-[#FF4F12] hover:underline">
                                    Return Policy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
