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
    const [activeTab, setActiveTab] = useState('specifications');

    // Check authentication status
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken);
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
                toast.error('Product not found. Please check the product ID.');
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
            name: "Tissot T-Race MotoGP",
            title: "Tissot T-Race MotoGP™ Quartz Chronograph (2025)",
            currentPrice: 65500,
            originalPrice: 65500,
            points: 65000,
            images: [
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/680/original/T137_407_11_351_00_B1.png",
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/681/original/T137_407_11_351_00_PROFIL.png",
                "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/682/original/T137-407-11-351-00_shadow.png"
            ],
            description: "Exclusive of all taxes EMI from ₹ 5851",
            longDescription: "The Tissot T-Race MotoGP collection represents the perfect fusion of Swiss precision and motorsport adrenaline. This timepiece embodies the spirit of MotoGP racing while incorporating cutting-edge technology and Swiss craftsmanship that Tissot is renowned for worldwide.",
            features: [
                "Swiss Quartz Chronograph Movement",
                "Swiss Made",
                "Water Resistant up to 100m", 
                "Stainless Steel Case",
                "Silicone Racing Strap",
                "Scratch-resistant Sapphire Crystal",
                "Tachymeter Scale",
                "Date Display"
            ],
            // Enhanced fields for new design
            brand: "Tissot",
            collection: "T-Sport",
            series: "Tissot T-Race MotoGP™",
            modelNumber: "T141.417.27.081.00",
            collectionDescription: "The T-Sport collection elevates Tissot watches for men and women that are absolutely sporty, with bold, versatile designs that emphasize strength and clarity. Geared towards sport enthusiasts looking for reliable, precision-driven watches that bring Swiss craftsmanship to the field. These Tissot watches offer an active lifestyle and are designed with performance, durability, and style in mind. T-Sport robust build and technical features reflect Tissot's involvement in high-intensity sports, including motorsports, diving and cycling. Contemporary waterproof wristwatches, the Tissot collection offers optimal timekeeping crafted with precision and reliability for sport environments and demanding environments, delivering excellence in Swiss timekeeping.",
            designFeatures: "The T-Sport collection features Tissot watches for men and women that are absolutely sporty, with bold, versatile designs that emphasize strength and clarity. Geared towards sport enthusiasts looking for reliable, precision-driven watches that bring Swiss craftsmanship to the field. These Tissot watches offer an active lifestyle and are designed with performance, durability, and style in mind. T-Sport robust build and technical features reflect Tissot's involvement in high-intensity sports, including motorsports, diving and cycling. Contemporary waterproof wristwatches, the Tissot collection offers optimal timekeeping crafted with precision and reliability for sport environments and demanding environments, delivering excellence in Swiss timekeeping.",
            heritage: "With over 170 years of Swiss watchmaking excellence, Tissot continues to push the boundaries of innovation while maintaining traditional craftsmanship values. Each timepiece in the T-Sport collection embodies this legacy, combining cutting-edge technology with timeless design principles.",
            technicalFeatures: "Advanced Swiss quartz chronograph movement with precision timing capabilities, robust stainless steel construction for durability, and ergonomic design optimized for active lifestyles.",
            qualityAssurance: "Every Tissot timepiece undergoes rigorous testing and quality control processes to ensure exceptional performance and reliability. Our commitment to excellence means each watch meets the highest standards of Swiss watchmaking.",
            specifications: {
                // Movement specifications
                movementFeatures: "Chronograph and Date Display",
                movement: "Quartz",
                dial: "N/A",
                
                // Case specifications  
                caseSize: "45",
                caseShape: "Round",
                caseMaterial: "Stainless Steel",
                
                // Dial specifications
                dialColor: "Black",
                
                // Strap specifications
                strapType: "Silicone",
                strapColor: "Black",
                
                // Additional specs
                waterResistance: "100m",
                glassType: "Sapphire Crystal",
                caseThickness: "12.5mm",
                lugWidth: "22mm"
            },
            additionalInfo: "This timepiece comes with a comprehensive 2-year international warranty and is delivered in an elegant Tissot presentation box, making it perfect for gifting or personal collection.",
            inStock: true,
            rating: 4.5,
            reviews: 127,
            color: "Black",
            material: "Stainless Steel",
            size: "45 mm",
            warranty: "2 years international warranty"
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
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF4F12] mx-auto mb-4"></div>
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
                                className="bg-[#FF4F12] text-white px-6 py-2 rounded-lg hover:bg-[#e63e0f]"
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
                                                currentImageIndex === index ? 'border-[#FF4F12]' : 'border-gray-200'
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
                                        <span className="text-2xl font-bold text-[#FF4F12]">
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
                    <div className="mt-16 bg-white rounded-lg shadow-sm">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button 
                                    onClick={() => setActiveTab('specifications')}
                                    className={`px-8 py-4 font-medium text-base transition-all duration-300 relative ${
                                        activeTab === 'specifications'
                                            ? 'text-[#FF4F12] bg-white'
                                            : 'text-gray-600 hover:text-gray-800 bg-gray-50'
                                    }`}
                                    style={{
                                        borderBottom: activeTab === 'specifications' ? '3px solid #FF4F12' : '3px solid transparent'
                                    }}
                                >
                                    Full Specifications
                                </button>
                                <button 
                                    onClick={() => setActiveTab('about')}
                                    className={`px-8 py-4 font-medium text-base transition-all duration-300 relative ${
                                        activeTab === 'about'
                                            ? 'text-[#FF4F12] bg-white'
                                            : 'text-gray-600 hover:text-gray-800 bg-gray-50'
                                    }`}
                                    style={{
                                        borderBottom: activeTab === 'about' ? '3px solid #FF4F12' : '3px solid transparent'
                                    }}
                                >
                                    About The Collections
                                </button>
                            </nav>
                        </div>

                        <div className="p-8">
                            {/* Specifications Tab Content */}
                            {activeTab === 'specifications' && (
                                <div className="animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        {/* Brand Section */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Brand</h4>
                                            <p className="text-lg font-medium text-gray-900">{product.brand || 'Tissot'}</p>
                                        </div>
                                        
                                        {/* Collection Section */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Collection</h4>
                                            <p className="text-lg font-medium text-gray-900">{product.collection || 'T-Sport'}</p>
                                        </div>
                                        
                                        {/* Series Section */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Series</h4>
                                            <p className="text-lg font-medium text-gray-900">{product.series || 'Tissot T-Race MotoGP™'}</p>
                                        </div>
                                        
                                        {/* Model No Section */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Model No.</h4>
                                            <p className="text-lg font-medium text-gray-900">{product.modelNumber || 'T141.417.27.081.00'}</p>
                                        </div>
                                    </div>

                                    {/* Specifications Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {/* Movement Section */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">MOVEMENT</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">FEATURES</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.movementFeatures || 'Chronograph and Date Display'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">MOVEMENT</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.movement || 'Quartz'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">DIAL</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.dial || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Case Section */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">CASE</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">CASE</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.caseSize || '45'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">CASE SHAPE</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.caseShape || 'Round'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">CASE MATERIAL</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.caseMaterial || 'Stainless Steel'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dial Section */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">DIAL</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">DIAL COLOUR</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.dialColor || 'Black'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Strap Section */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">STRAP</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">STRAP TYPE</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.strapType || 'Silicone'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">STRAP COLOUR</h4>
                                                    <p className="text-sm text-gray-700">{productSpecs.strapColor || 'Black'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Features if available from API */}
                                    {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                                        <div className="mt-12">
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-6">Key Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {product.features.map((feature, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <div className="w-2 h-2 bg-[#FF4F12] rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* About Tab Content */}
                            {activeTab === 'about' && (
                                <div className="animate-fadeIn">
                                    <div className="max-w-none">
                                        <h3 className="text-2xl font-bold text-[#FF4F12] mb-8">
                                            About the {product.brand || 'Tissot'} {product.collection || 'T-Sport'} Collection
                                        </h3>
                                        
                                        {/* Main Collection Description */}
                                        <div className="prose prose-lg max-w-none mb-8">
                                            <p className="text-gray-700 leading-relaxed text-base mb-6">
                                                {product.collectionDescription || 
                                                `The T-Sport collection elevates ${product.brand || 'Tissot'} watches for men and women that are absolutely sporty, with bold, versatile designs that emphasize strength and clarity. Geared towards range from classic to extreme, providing a substantial look and performance for demanding environments. With precision movement, performance technologies, and creating dynamic design, high-contrast dials and transitional renditions enhance legibility in all lighting conditions, with straps available in rubber, leather, or stainless steel for maximum comfort and flexibility. Powered by Swiss automatic or quartz movement, T-Sport watches ensure accurate timekeeping and dependable performance for demanding environments.`}
                                            </p>
                                        </div>

                                        {/* Design And Features Section */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-6">Design And Features</h4>
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {product.designFeatures || 
                                                `The T-Sport collection features ${product.brand || 'Tissot'} watches for men and women that are absolutely sporty, with bold, versatile designs that emphasize strength and clarity. Geared towards sport enthusiasts looking for reliable, precision-driven watches that bring Swiss craftsmanship to the field. These ${product.brand || 'Tissot'} watches offer an active lifestyle and are designed with performance, durability, and style in mind. T-Sport robust build and technical features reflect ${product.brand || 'Tissot'}'s involvement in high-intensity sports, including motorsports, diving and cycling. Contemporary waterproof wristwatches, the ${product.brand || 'Tissot'} collection offers optimal timekeeping crafted with precision and reliability for sport environments and demanding environments, delivering excellence in Swiss timekeeping.`}
                                            </p>
                                        </div>

                                        {/* Additional Information from API */}
                                        {product.additionalInfo && (
                                            <div className="mb-8">
                                                <h4 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h4>
                                                <p className="text-gray-700 leading-relaxed text-base">
                                                    {product.additionalInfo}
                                                </p>
                                            </div>
                                        )}

                                        {/* Heritage & Craftsmanship */}
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-6">Heritage & Craftsmanship</h4>
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {product.heritage || 
                                                `With over 170 years of Swiss watchmaking excellence, ${product.brand || 'Tissot'} continues to push the boundaries of innovation while maintaining traditional craftsmanship values. Each timepiece in the ${product.collection || 'T-Sport'} collection embodies this legacy, combining cutting-edge technology with timeless design principles.`}
                                            </p>
                                        </div>

                                        {/* Technical Innovation */}
                                        {(product.technicalFeatures || product.innovation) && (
                                            <div className="mb-8">
                                                <h4 className="text-xl font-bold text-gray-900 mb-6">Technical Innovation</h4>
                                                <p className="text-gray-700 leading-relaxed text-base">
                                                    {product.technicalFeatures || product.innovation}
                                                </p>
                                            </div>
                                        )}

                                        {/* Quality Assurance */}
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4">Quality Assurance</h4>
                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                {product.qualityAssurance || 
                                                `Every ${product.brand || 'Tissot'} timepiece undergoes rigorous testing and quality control processes to ensure exceptional performance and reliability. Our commitment to excellence means each watch meets the highest standards of Swiss watchmaking.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
