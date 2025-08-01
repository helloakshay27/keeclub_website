import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, RotateCcw } from 'lucide-react';

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check authentication status
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken);
    }, []);

    // Sample product data - in real app, fetch from API based on id
    const product = {
        id: 1,
        name: "Tissot",
        title: "Tissot T-Race MotoGP Quartz Chronograph (2025)",
        currentPrice: 65000,
        originalPrice: 85000,
        points: 65000,
        images: [
            "/src/assets/Hotel/Card1.png",
            "/src/assets/Hotel/Card2.png",
            "/src/assets/Hotel/Card3.png"
        ],
        description: "Exclusive of all taxes EMI from ₹ 5851",
        features: [
            "Chronograph and Date Display",
            "Swiss Movement",
            "Water Resistant",
            "Premium Materials"
        ],
        specifications: {
            brand: "Tissot",
            model: "T-Sport",
            movement: "Quartz",
            caseSize: "45mm",
            caseMaterial: "Stainless Steel",
            dialColor: "Black",
            strapType: "Silicon",
            strapColor: "Round",
            waterResistance: "100m"
        },
        inStock: true,
        rating: 4.5,
        reviews: 127
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleClaimNow = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        } else {
            // Proceed to redeem points page
            navigate('/redeem-points', { 
                state: { 
                    product: product,
                    orderType: 'promotion'
                } 
            });
        }
    };

    const handleLoginRedirect = () => {
        // Store the intended destination
        localStorage.setItem('redirectAfterLogin', `/promotion-detail/${id}`);
        navigate('/login');
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Breadcrumb */}
      

            <div className="max-w-7xl mx-auto px-4 py-8 pt-30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                            />
                            
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                                            currentImageIndex === index ? 'border-[#FF4F12]' : 'border-gray-200'
                                        }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-lg text-[#FF4F12] font-medium mb-4">
                                {product.title}
                            </p>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${
                                                i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Current MRP:</span>
                                    <span className="text-2xl font-bold text-gray-800">
                                        {formatPrice(product.currentPrice)}
                                    </span>
                                </div>
                                {product.originalPrice > product.currentPrice && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Original Price:</span>
                                        <span className="text-lg text-gray-500 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <span className="text-gray-600">Redeemed Points:</span>
                                    <span className="text-2xl font-bold text-[#FF4F12]">
                                        ⭐ {product.points.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total Payable:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹ 0.00
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="text-sm text-gray-500">
                                <p>*Inclusive of all taxes</p>
                                <p>EMI from ₹ 5851</p>
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleClaimNow}
                                disabled={!product.inStock}
                                className="w-full bg-[#24293c] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1a1f2e] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {product.inStock ? 'Claim Now' : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="text-[#FF4F12]" size={20} />
                                <span className="text-sm text-gray-600">Warranty Included</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Truck className="text-[#FF4F12]" size={20} />
                                <span className="text-sm text-gray-600">Free Delivery</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RotateCcw className="text-[#FF4F12]" size={20} />
                                <span className="text-sm text-gray-600">Easy Returns</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="text-[#FF4F12]" size={20} />
                                <span className="text-sm text-gray-600">Authentic Product</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            <button className="py-4 px-1 border-b-2 border-[#FF4F12] font-medium text-sm text-[#FF4F12]">
                                Full Specifications
                            </button>
                            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                                About The Collections
                            </button>
                        </nav>
                    </div>

                    <div className="py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">BRAND</h4>
                                <p className="text-gray-600">{product.specifications.brand}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">MODEL</h4>
                                <p className="text-gray-600">{product.specifications.model}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">MOVEMENT</h4>
                                <p className="text-gray-600">{product.specifications.movement}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">CASE SIZE</h4>
                                <p className="text-gray-600">{product.specifications.caseSize}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">CASE MATERIAL</h4>
                                <p className="text-gray-600">{product.specifications.caseMaterial}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">DIAL COLOR</h4>
                                <p className="text-gray-600">{product.specifications.dialColor}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">STRAP TYPE</h4>
                                <p className="text-gray-600">{product.specifications.strapType}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">WATER RESISTANCE</h4>
                                <p className="text-gray-600">{product.specifications.waterResistance}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-[#FF4F12] mb-4">
                                About the Tissot T-Sport Collection
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                The T-Sport collection from Tissot was launched in the early 2000s to meet the demands of sport enthusiasts looking for reliable, precision-driven watches that bring timely craftsmanship to the field. These Tissot watches aren to be confused with performance, durability, and style in mind. T-Sport's robust builds and technical features reflect Tissot's commitment to high-intensity sports, including motorsports, diving, and cycling, underscoring the brand's commitment to quality action pursuits.
                            </p>
                            
                            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                                Design And Features
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                                The T-Sport collection features Tissot watches for men and women that are distinctly sporty, with bold, versatile designs that emphasise strength and clarity. Cases generally range from 38mm to 45mm, providing a substantial wrist presence without compromising wearability. Shapes are predominantly round, allowing for streamlined chronograph layouts, tachymeters, and rotating bezels. High contrast dials and luminescent markers enhance legibility in all lighting conditions, with straps available in rubber, nylon, or stainless steel for maximum comfort and flexibility. Powered by Swiss automatic or quartz movements, T-Sport watches deliver precise chronometric and dependable performance for demanding environments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Login Required</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Please login to proceed with your promotion claim.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLoginRedirect}
                                className="flex-1 px-4 py-2 bg-[#FF4F12] text-white rounded-lg hover:bg-[#e63e0f]"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionDetail;
