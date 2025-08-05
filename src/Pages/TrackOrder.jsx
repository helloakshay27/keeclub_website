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
                console.log('✅ Order data loaded:', response.data);
                
                // Determine current status from API response
                const statusMap = {
                    'pending': 1,
                    'confirmed': 1,
                    'processing': 2,
                    'shipped': 3,
                    'in_transit': 3,
                    'out_for_delivery': 3,
                    'delivered': 4,
                    'cancelled': 0,
                    'refunded': 0
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

    const orderStatuses = orderData?.orderStatusLogs ? orderData.orderStatusLogs.map((log, index) => ({
        id: index + 1,
        title: log.status.charAt(0).toUpperCase() + log.status.slice(1).replace('_', ' '),
        description: log.notes || `Order status updated to ${log.status}`,
        icon: [CheckCircle, Package, Truck, CheckCircle][index] || CheckCircle,
        completed: true,
        timestamp: new Date(log.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    })) : [
        {
            id: 1,
            title: "Order Confirmed",
            description: "Your order has been confirmed and is being processed",
            icon: CheckCircle,
            completed: currentStatus >= 1,
            timestamp: orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : "Loading..."
        },
        {
            id: 2,
            title: "Order Processed",
            description: "Your order has been processed and is ready for dispatch",
            icon: Package,
            completed: currentStatus >= 2,
            timestamp: currentStatus >= 2 ? "Processing..." : ""
        },
        {
            id: 3,
            title: "Order Shipped",
            description: "Your order has been shipped and is on the way",
            icon: Truck,
            completed: currentStatus >= 3,
            timestamp: currentStatus >= 3 ? "Shipped..." : ""
        },
        {
            id: 4,
            title: "Order Delivered",
            description: "Your order has been delivered successfully",
            icon: CheckCircle,
            completed: currentStatus >= 4,
            timestamp: currentStatus >= 4 ? "Delivered..." : ""
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
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f9461c] mx-auto mb-4"></div>
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
                            className="px-6 py-3 bg-[#f9461c] text-white rounded-lg hover:bg-[#e63e0f]"
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
                        className="px-6 py-3 bg-[#f9461c] text-white rounded-lg hover:bg-[#e63e0f]"
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
                            <p className="text-gray-600">
                                Order ID: #{orderData?.orderNumber || orderId}
                            </p>
                            {orderData && (
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        orderData.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        orderData.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                        orderData.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                        orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Ordered on {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/promotions')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Back to Promotions
                        </button>
                    </div>
                    
                    {orderData?.orderItems && orderData.orderItems.length > 0 && (
                        <div className="space-y-4">
                            {orderData.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.product.primaryImage}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                                        <p className="text-sm text-[#f9461c]">SKU: {item.product.sku}</p>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity} | Points Used: ⭐ {orderData.loyaltyPointsRedeemed?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">{formatPrice(item.totalPrice)}</p>
                                        <p className="text-sm text-green-600">Paid with Points</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Fallback for when no order data but product is available */}
                    {!orderData?.orderItems && product && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-[#f9461c]">{product.title}</p>
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
                                                        ? 'bg-[#f9461c] text-white'
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
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f9461c] mr-2"></div>
                                                            <span className="text-sm text-[#f9461c] font-medium">
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
                                            {currentStatus === 3 ? 'Out for Delivery' : 'Delivered'}
                                        </span>
                                    </div>
                                    <p className="text-blue-700 text-sm mb-2">
                                        {currentStatus === 3 
                                            ? `Your package is out for delivery to ${orderData?.shippingAddress?.city || 'your location'} and will arrive today between 10:00 AM - 6:00 PM`
                                            : 'Your package has been delivered successfully'
                                        }
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Tracking ID: KCL{orderData?.orderNumber || orderId}
                                    </p>
                                    {orderData?.shippingAddress && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            Delivering to: {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pinCode}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="mr-2 text-[#f9461c]" size={20} />
                                Delivery Address
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                {orderData?.shippingAddress ? (
                                    <>
                                        <p className="font-medium text-gray-800">
                                            Delivery Address
                                        </p>
                                        <p>{orderData.shippingAddress.address}</p>
                                        <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
                                        <p>PIN: {orderData.shippingAddress.pinCode}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium text-gray-800">
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </p>
                                        <p>{userDetails?.address || "Address being updated..."}</p>
                                        <p className="flex items-center mt-2">
                                            <Phone size={14} className="mr-1" />
                                            {userDetails?.phone || "Phone number loading..."}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        {(orderData?.orderItems || product) && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {orderData?.orderItems ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal ({orderData.totalItems} item{orderData.totalItems > 1 ? 's' : ''})</span>
                                                <span>{formatPrice(orderData.orderItems.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                                            </div>
                                            <div className="flex justify-between text-[#f9461c]">
                                                <span>Loyalty Points Used</span>
                                                <span>⭐ {orderData.loyaltyPointsRedeemed?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                                <span>Loyalty Discount</span>
                                                <span>-{formatPrice(orderData.loyaltyDiscountAmount)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Delivery</span>
                                                <span className="text-green-600">Free</span>
                                            </div>
                                            <div className="border-t pt-3">
                                                <div className="flex justify-between font-semibold">
                                                    <span>Total Paid</span>
                                                    <span className="text-green-600">{formatPrice(orderData.totalAmount)}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Item Price</span>
                                                <span>{formatPrice(product.currentPrice)}</span>
                                            </div>
                                            <div className="flex justify-between text-[#f9461c]">
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
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Help & Support */}
                        {/* <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Need Help?
                            </h3>
                            <div className="space-y-3 text-sm">
                                <button className="w-full text-left text-[#f9461c] hover:underline">
                                    Contact Customer Support
                                </button>
                                <button className="w-full text-left text-[#f9461c] hover:underline">
                                    Report an Issue
                                </button>
                                <button className="w-full text-left text-[#f9461c] hover:underline">
                                    Return Policy
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
