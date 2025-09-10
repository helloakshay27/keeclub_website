import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import promotionAPI from '../services/promotionAPI';

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication status
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        // More robust authentication check
        const isUserAuthenticated = authToken && authToken !== 'null' ;
        setIsAuthenticated(isUserAuthenticated);
        
        console.log('🔐 Authentication Check:', {
            hasToken: !!authToken,
            isAuthenticated: isUserAuthenticated
        });
    }, []);

    // Fetch product data from API
    useEffect(() => {
        fetchProductData();
    }, [id]);

    const fetchProductData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Fetching product details for ID:', id);
            const response = await promotionAPI.getPromotionById(id);
            
            if (response.success && response.data) {
                setProduct(response.data);
                console.log('✅ Product loaded successfully:', response.data);
                toast.success(`Product "${response.data.name}" loaded successfully!`);
            } else {
                setError('Product not found');
                console.error('❌ Failed to load product:', response.message);
                toast.error('Product not found. Loading sample data as fallback.');
                // Fallback to static data
                setProduct(getStaticProductData());
            }
        } catch (error) {
            setError('Failed to load product details');
            console.error('❌ Network error:', error);
            toast.error('Network error occurred. Loading sample data as fallback.');
            
            // Fallback to static data
            setProduct(getStaticProductData());
        } finally {
            setLoading(false);
        }
    };

    const getStaticProductData = () => {
        return {
            id: parseInt(id),
            name: "Tissot PRX 40mm",
            title: "Tissot T137.407.11.351.00",
            currentPrice: 74500,
            originalPrice: 74500,
            points: 74500,
            images: [
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/680/original/T137_407_11_351_00_B1.png",
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/681/original/T137_407_11_351_00_PROFIL.png",
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/682/original/T137-407-11-351-00_shadow.png"
            ],
            description: "If you're looking for a slim, smooth watch with an authentic '70s feel, look no further than the PRX Powermatic 80. Created for those with an eye for design and packed with twenty-first century features in a Tissot case shape from 1978, the PRX is a must-have on every watch fan's wish list.",
            features: [
                "Powermatic 80 Movement",
                "Swiss Made",
                "Water Resistant",
                "Stainless Steel Case"
            ],
            specifications: {
                brand: "TISSOT",
                model: "T137.407.11.351.00",
                movement: "Powermatic 80",
                caseSize: "40mm",
                caseMaterial: "Stainless Steel",
                dialColor: "Silver",
                strapType: "Steel Bracelet",
                strapColor: "Silver",
                waterResistance: "100m"
            },
            inStock: true,
            rating: 4.5,
            reviews: 127,
            brand: "TISSOT",
            modelNumber: "T137.407.11.351.00",
            color: "Silver",
            material: "Stainless Steel",
            size: "40 mm",
            warranty: "1 year"
        };
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
        if (product && product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => 
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product && product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    const handleClaimNow = () => {
        const authToken = localStorage.getItem('authToken');
        
        // Check if user is properly authenticated
        if (!authToken || authToken === 'null') {
            console.log('🔐 User not authenticated, showing login modal');
            toast.warning('Please login to claim this promotion');
            setShowLoginModal(true);
        } else {
            console.log('🔐 User authenticated, proceeding to redeem points');
            toast.success('Redirecting to redeem points...');
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

    // Safe rendering helpers
    const safeImages = product?.images && Array.isArray(product.images) ? product.images : [];
    const currentImage = safeImages[currentImageIndex] || safeImages[0] || "/src/assets/Hotel/Card1.png";
    const productSpecs = product?.specifications || {};

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f9461c] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product details...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && !product && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-x-4">
                            <button 
                                onClick={fetchProductData}
                                className="bg-[#f9461c] text-white px-6 py-2 rounded-lg hover:bg-[#e63e0f]"
                            >
                                Retry
                            </button>
                            <button 
                                onClick={() => navigate('/promotions')}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Back to Promotions
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Content */}
            {product && !loading && (
                <div className="max-w-7xl mx-auto px-4 py-8 pt-30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = "/src/assets/Hotel/Card1.png";
                                    }}
                                />
                                
                                {safeImages.length > 1 && (
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
                            {safeImages.length > 1 && (
                                <div className="flex space-x-2">
                                    {safeImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                                                currentImageIndex === index ? 'border-[#f9461c]' : 'border-gray-200'
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            onError={(e) => {
                                                e.target.src = "/src/assets/Hotel/Card1.png";
                                            }}
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
                                <p className="text-lg text-[#f9461c] font-medium mb-4">
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
                                                    i < Math.floor(product.rating || 0)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.rating || 0} ({product.reviews || product.reviewsCount || 0} reviews)
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
                                        <span className="text-2xl font-bold text-[#f9461c]">
                                            ⭐ {(product.points || product.currentPrice || 0).toLocaleString()}
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
                                    <p>SKU: {product.sku || 'N/A'}</p>
                                    {product.warranty && <p>Warranty: {product.warranty}</p>}
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
                                    <Shield className="text-[#f9461c]" size={20} />
                                    <span className="text-sm text-gray-600">Warranty Included</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Truck className="text-[#f9461c]" size={20} />
                                    <span className="text-sm text-gray-600">Free Delivery</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RotateCcw className="text-[#f9461c]" size={20} />
                                    <span className="text-sm text-gray-600">Easy Returns</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="text-[#f9461c]" size={20} />
                                    <span className="text-sm text-gray-600">Authentic Product</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-12">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                <button className="py-4 px-1 border-b-2 border-[#f9461c] font-medium text-sm text-[#f9461c]">
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
                                    <p className="text-gray-600">{productSpecs.brand || product.brand || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">MODEL</h4>
                                    <p className="text-gray-600">{productSpecs.model || product.modelNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">MATERIAL</h4>
                                    <p className="text-gray-600">{productSpecs.caseMaterial || product.material || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">SIZE</h4>
                                    <p className="text-gray-600">{productSpecs.caseSize || product.size || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">COLOR</h4>
                                    <p className="text-gray-600">{productSpecs.dialColor || product.color || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">MOVEMENT</h4>
                                    <p className="text-gray-600">{productSpecs.movement || 'Quartz'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">STRAP TYPE</h4>
                                    <p className="text-gray-600">{productSpecs.strapType || 'Steel Bracelet'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">WATER RESISTANCE</h4>
                                    <p className="text-gray-600">{productSpecs.waterResistance || '100m'}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-[#f9461c] mb-4">
                                    About the {product.brand || 'Tissot'} Collection
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || 'Premium collection featuring exceptional craftsmanship and innovative design. Each piece combines traditional watchmaking expertise with modern technology to deliver reliable performance and timeless style.'}
                                </p>
                                
                                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                                    Design And Features
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                    This collection features watches that are distinctly elegant, with bold, versatile designs that emphasize strength and clarity. Premium materials and precise movements ensure exceptional performance and durability for everyday wear or special occasions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                className="flex-1 px-4 py-2 bg-[#f9461c] text-white rounded-lg hover:bg-[#e63e0f]"
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
