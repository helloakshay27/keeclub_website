import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit } from 'lucide-react';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};
    
    const [deliveryAddress, setDeliveryAddress] = useState({
        name: 'Anamika Chandel',
        type: 'Home',
        phone: '9890887363',
        address: '408, Floor no.4, Sumer Kendra, Worli West, Mumbai, Maharashtra-400030'
    });

    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const handleConfirmOrder = () => {
        // Generate random order ID
        const orderId = Math.floor(1000 + Math.random() * 9000);
        
        navigate('/order-success', {
            state: {
                orderId,
                product,
                deliveryAddress
            }
        });
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
        <div className="min-h-screen bg-gray-50 py-12 pt-30">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Column - Order Summary & Delivery Address */}
                        <div className="space-y-8">
                            {/* Order Summary */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                                <div className="flex items-start space-x-6">
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{product.brand}</h3>
                                        <p className="text-[#fa4615] text-base mb-3">{product.name}</p>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>*Inclusive of all taxes</p>
                                            <p>EMI from ₹ 5851</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Delivery Address</h2>
                                    <button 
                                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <Edit size={20} />
                                    </button>
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
                                                    <span className="font-bold text-lg">{deliveryAddress.name}</span>
                                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">{deliveryAddress.type}</span>
                                                    <span className="font-bold text-lg">{deliveryAddress.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 ml-8 leading-relaxed">{deliveryAddress.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Price Details & Redeem Points */}
                        <div className="space-y-8">
                            {/* Price Details */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Price details</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-lg">
                                        <span>Price (1 Item)</span>
                                        <span>₹ {product.points.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span>Redeemed Points</span>
                                        <span className="text-orange-500 flex items-center">
                                            <span className="text-orange-500 mr-1">🔹</span>
                                            {product.points.toLocaleString()}
                                        </span>
                                    </div>
                                    <hr className="border-gray-300" />
                                    <div className="flex justify-between font-bold text-xl">
                                        <span>Total Payable</span>
                                        <span>0.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Redeem Your Points Section */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">Redeem Your Points</h3>
                                <p className="text-gray-600 mb-4">Choose from exclusive rewards curated just for you</p>
                                <div className="mb-4">
                                    <span className="text-sm text-gray-600">Your Points Balance: </span>
                                    <span className="text-orange-500 font-bold">
                                        🔹 You have {product.points.toLocaleString()} Points
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Point Code"
                                        className="flex-1 border border-gray-300 rounded px-4 py-3"
                                    />
                                    <button className="bg-[#24293c] text-white px-6 py-3 rounded font-semibold hover:bg-[#1a1f2e]">
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleConfirmOrder}
                            className="bg-[#24293c] text-white px-16 py-4 rounded-lg text-lg font-semibold hover:bg-[#1a1f2e] transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
