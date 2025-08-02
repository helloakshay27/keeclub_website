import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import promotionAPI from '../services/promotionAPI';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetails, product, deliveryAddress, fromOrdersList } = location.state || {};
    
    const [order, setOrder] = useState(orderDetails || null);
    const [loading, setLoading] = useState(!orderDetails);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderDetails && orderId) {
            fetchOrderDetails();
        }
    }, [orderId, orderDetails]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Fetching order details for ID:', orderId);
            const response = await promotionAPI.trackOrder(orderId);
            
            if (response.success) {
                setOrder(response.data);
                console.log('✅ Order details loaded:', response.data);
            } else {
                setError('Order not found');
                console.error('❌ Failed to load order:', response.message);
            }
        } catch (error) {
            setError('Failed to load order details');
            console.error('❌ Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-600',
            confirmed: 'text-blue-600',
            processing: 'text-indigo-600',
            shipped: 'text-purple-600',
            delivered: 'text-green-600',
            cancelled: 'text-red-600',
            refunded: 'text-gray-600'
        };
        return colors[status] || 'text-gray-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleTrackOrder = () => {
        navigate(`/track-order/${orderId}`, {
            state: {
                orderDetails: order,
                product: order?.orderItems?.[0]?.product || product
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 pt-30">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading order details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 pt-30">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                            <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
                            <button 
                                onClick={() => navigate('/orders')}
                                className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e63e0f]"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const orderProduct = order.orderItems?.[0]?.product || product;
    const address = order.shippingAddress || deliveryAddress;

    return (
        <div className="min-h-screen bg-gray-50 py-8 pt-30">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => fromOrdersList ? navigate('/orders') : navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {fromOrdersList ? 'Back to Orders' : 'Back'}
                </button>

                {/* Success Header */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                        <p className="text-lg text-gray-600 mb-4">Order #{order.orderNumber || order.order_number}</p>
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                Placed on {formatDate(order.createdAt || order.created_at)}
                            </span>
                            <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="space-y-6">
                        {/* Product Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Product Details</h2>
                            <div className="flex items-start space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {orderProduct?.primaryImage || orderProduct?.primary_image ? (
                                        <img
                                            src={orderProduct.primaryImage || orderProduct.primary_image}
                                            alt={orderProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                        {orderProduct?.name || order.orderItems?.[0]?.itemName}
                                    </h3>
                                    {orderProduct?.sku && (
                                        <p className="text-gray-600 text-sm mb-2">SKU: {orderProduct.sku}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Quantity: {order.orderItems?.[0]?.quantity || 1}</span>
                                        <span className="font-medium">
                                            ₹{(order.orderItems?.[0]?.totalPrice || order.totalAmount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {address && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">{address.contactPerson || address.contact_person}</p>
                                        {address.mobile && (
                                            <p className="text-gray-600 text-sm">{address.mobile}</p>
                                        )}
                                        <p className="text-gray-700 mt-1">
                                            {address.address}
                                            {address.city && `, ${address.city}`}
                                            {address.state && `, ${address.state}`}
                                            {address.pinCode || address.pin_code ? ` - ${address.pinCode || address.pin_code}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Order Status</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                                    <div>
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-gray-600">{formatDate(order.createdAt || order.created_at)}</p>
                                    </div>
                                </div>
                                {order.status !== 'pending' && (
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                                        <div>
                                            <p className="font-medium capitalize">{order.status}</p>
                                            <p className="text-sm text-gray-600">{formatDate(order.updatedAt || order.updated_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment & Actions */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal ({order.totalItems || 1} item{(order.totalItems || 1) > 1 ? 's' : ''})</span>
                                    <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
                                </div>
                                {order.loyaltyPointsRedeemed > 0 && (
                                    <div className="flex justify-between text-orange-600">
                                        <span>Loyalty Points Used</span>
                                        <span>🔹 {order.loyaltyPointsRedeemed.toLocaleString()}</span>
                                    </div>
                                )}
                                {order.loyaltyDiscountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Loyalty Discount</span>
                                        <span>-₹{order.loyaltyDiscountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Paid</span>
                                    <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Status</h2>
                            <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium capitalize">{order.paymentStatus || order.payment_status}</p>
                                    {order.loyaltyPointsRedeemed > 0 && (
                                        <p className="text-sm text-gray-600">Paid using loyalty points</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                      

                        {/* Order Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800 mb-2">Order Information</h3>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>Order ID: {order.id}</p>
                                <p>Order Number: {order.orderNumber || order.order_number}</p>
                                {order.loyaltyPointsEarned > 0 && (
                                    <p>Points Earned: {order.loyaltyPointsEarned}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
