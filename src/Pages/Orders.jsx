import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin, Eye, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import promotionAPI from '../services/promotionAPI';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('All');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        // Check if user is properly authenticated
        if (!authToken || authToken === 'null') {
            console.log('🔐 User not authenticated, redirecting to login');
            toast.error('Please login to access this page');
            navigate('/login');
            return;
        }
        
        console.log('🔐 User authenticated, proceeding to fetch orders');
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Fetching user orders...');
            const response = await promotionAPI.getUserOrders();
            
            if (response.success) {
                setOrders(response.data.orders);
                console.log('✅ Orders loaded:', response.data.orders);
                toast.success(`${response.data.orders.length} orders loaded successfully!`);
            } else {
                setError('Failed to load orders');
                console.error('❌ Failed to load orders:', response.message);
                toast.error('Failed to load orders from server.');
            }
        } catch (error) {
            setError('Network error while loading orders');
            console.error('❌ Network error:', error);
            toast.error('Network error occurred while loading orders.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
            processing: { color: 'bg-indigo-100 text-indigo-800', text: 'Processing' },
            shipped: { color: 'bg-purple-100 text-purple-800', text: 'Shipped' },
            delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
            refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewOrder = (order) => {
        // Navigate to order detail page using OrderSuccess component
        navigate(`/order-detail/${order.id}`, {
            state: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                orderDetails: order,
                product: order.orderItems[0]?.product,
                deliveryAddress: order.shippingAddress,
                loyaltyPointsUsed: order.loyaltyPointsRedeemed,
                totalAmount: order.totalAmount,
                fromOrdersList: true
            }
        });
    };

    const handleTrackOrder = (order) => {
        navigate(`/track-order/${order.id}`, {
            state: {
                orderDetails: order,
                product: order.orderItems[0]?.product
            }
        });
    };

    const filteredOrders = orders.filter(order => {
        if (selectedFilter === 'All') return true;
        return order.status.toLowerCase() === selectedFilter.toLowerCase();
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 pt-30">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 pt-30">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button 
                                onClick={fetchOrders}
                                className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e63e0f]"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 pt-30">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your recent orders</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex flex-wrap border-b">
                        {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    selectedFilter === filter
                                        ? 'border-[#fa4615] text-[#fa4615]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {filter} ({filter === 'All' ? orders.length : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase()).length})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-6">
                            {selectedFilter === 'All' 
                                ? "You haven't placed any orders yet." 
                                : `No ${selectedFilter.toLowerCase()} orders found.`}
                        </p>
                        <button
                            onClick={() => navigate('/promotions')}
                            className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e63e0f]"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {formatDate(order.createdAt)}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Package className="w-4 h-4 mr-1" />
                                                        {order.totalItems} item{order.totalItems > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(order.status)}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleTrackOrder(order)}
                                                    className="flex items-center px-3 py-2 text-sm bg-[#fa4615] text-white rounded-lg hover:bg-[#e63e0f]"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-1" />
                                                    Track
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {order.orderItems.map((item) => (
                                            <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product?.primaryImage ? (
                                                        <img
                                                            src={item.product.primaryImage}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">
                                                        {item.product?.name || item.itemName}
                                                    </h4>
                                                    {item.product?.sku && (
                                                        <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-800">
                                                        ₹{typeof item.totalPrice === 'number' ? item.totalPrice.toLocaleString('en-IN') : item.totalPrice}
                                                    </p>
                                                    {order.loyaltyPointsRedeemed > 0 && (
                                                    <p className="text-sm text-orange-600">
                                                        🔹 {typeof order.loyaltyPointsRedeemed === 'number' ? order.loyaltyPointsRedeemed.toLocaleString('en-IN') : order.loyaltyPointsRedeemed} points used
                                                    </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                                            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                                {order.shippingAddress && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span>
                                                            {order.shippingAddress.city}, {order.shippingAddress.state}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <CreditCard className="w-4 h-4 mr-1" />
                                                    <span className="capitalize">{order.paymentStatus}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-800">
                                                    Total: ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toLocaleString('en-IN') : order.totalAmount}
                                                </p>
                                                {order.loyaltyDiscountAmount > 0 && (
                                                    <p className="text-sm text-green-600">
                                                        Saved: ₹{typeof order.loyaltyDiscountAmount === 'number' ? order.loyaltyDiscountAmount.toLocaleString('en-IN') : order.loyaltyDiscountAmount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
