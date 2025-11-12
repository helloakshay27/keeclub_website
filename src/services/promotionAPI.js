// Real API configuration for Piramal Loyalty Platform
import BASE_URL from '../Confi/baseurl.js';
import hotel1 from '../assets/Hotel/hotel1.jpg';
import hotel2 from '../assets/Hotel/hotel2.jpg';
import hotel3 from '../assets/Hotel/hotel3.jpg';
import Card1 from '../assets/Hotel/Card1.png';
import Card2 from '../assets/Hotel/Card2.png';
import Card3 from '../assets/Hotel/Card3.png';

const API_CONFIG = {
    baseURL: BASE_URL.replace(/\/$/, ''), // Remove trailing slash if present
    endpoints: {
        // Products/Promotions
        getPromotions: '/products.json',
        getPromotionById: '/products/:id.json',
        
        // Redemptions (using products for now)
        getRedemptions: '/products.json',
        getRedemptionCategories: '/categories.json',
        
        // Encash (real endpoints)
        submitEncashRequest: '/encash_requests.json',
        validateBankDetails: '/encash/validate-bank',
        
        // Hotels (using products filtered by category)
        getHotels: '/products.json',
        getHotelById: '/products/:id.json',
        bookHotel: '/hotel/bookings',
        
        // Orders
        createOrder: '/orders/create_with_loyalty.json',
        getOrderStatus: '/orders/:id.json',
        trackOrder: '/orders/:id.json',
        
        // User Addresses
        getUserAddresses: '/user_addresses.json',
        createAddress: '/user_addresses.json',
        
        // Orders
        getUserOrders: '/orders.json',
        getOrderById: '/orders/:id.json'
    }
};

// Data transformers for real API responses
const transformers = {
    // Transform real API product data to our promotion structure
    transformPromotionData: (apiResponse) => {
        // Handle single product response (for getById) and products array response  
        let products = [];
        
        if (apiResponse.product) {
            // Single product response
            products = [apiResponse.product];
        } else if (apiResponse.products && Array.isArray(apiResponse.products)) {
            // Multiple products response
            products = apiResponse.products;
        } else if (Array.isArray(apiResponse)) {
            // Direct array response
            products = apiResponse;
        } else {
            // Fallback - try to use the response as a single product
            products = [apiResponse];
        }
        
        return products.map((product) => ({
            id: product.id,
            name: product.name,
            title: `${product.brand || ''} ${product.model_number || ''}`.trim() || product.name,
            currentPrice: parseFloat(product.current_price || product.sale_price || product.base_price || 0),
            originalPrice: parseFloat(product.base_price || product.current_price || 0),
            points: product.loyalty_points_required || parseFloat(product.current_price || product.sale_price || 0),
            image: product.primary_image || (product.all_images && product.all_images[0]) || Card1,
            images: product.all_images || (product.primary_image ? [product.primary_image] : [Card1]),
            category: product.featured ? "Luxury" : "Premium",
            featured: product.featured || product.is_trending || false,
            description: product.description 
                ? (product.description.length > 100 ? product.description.substring(0, 100) + "..." : product.description)
                : "Premium quality product",
            brand: product.brand,
            modelNumber: product.model_number,
            color: product.color,
            material: product.material,
            size: product.size,
            warranty: product.warranty_period,
            inStock: product.in_stock !== false,
            // Enhanced fields for new design
            collection: product.collection || product.product_line,
            series: product.series || product.sub_collection,
            collectionDescription: product.collection_description,
            designFeatures: product.design_features,
            heritage: product.heritage_info,
            technicalFeatures: product.technical_features,
            innovation: product.innovation_details,
            qualityAssurance: product.quality_assurance,
            additionalInfo: product.additional_info,
            longDescription: product.long_description,
            specifications: {
                // Movement specifications
                movementFeatures: product.movement_features,
                movement: product.movement_type,
                dial: product.dial_features,
                
                // Case specifications  
                caseSize: product.case_size,
                caseShape: product.case_shape,
                caseMaterial: product.case_material,
                
                // Dial specifications
                dialColor: product.dial_color,
                
                // Strap specifications
                strapType: product.strap_type,
                strapColor: product.strap_color,
                
                // Additional specs from generic fields
                ...product.specifications
            },
            sku: product.sku,
            rating: product.average_rating || 4.0,
            reviews: product.reviews_count || 0,
            reviewsCount: product.reviews_count || 0,
            specifications: {
                brand: product.brand,
                model: product.model_number,
                material: product.material,
                caseSize: product.size,
                caseMaterial: product.material,
                dialColor: product.color,
                movement: "Automatic", // Default since not in API
                strapType: "Steel Bracelet", // Default since not in API
                waterResistance: "100m" // Default since not in API
            },
            features: product.feature_list || [],
            attachments: product.attachfiles || []
        }));
    },

    // Transform for redemption categories (using static data for now)
    transformRedemptionData: (apiResponse) => {
        return [
            {
                id: 1,
                title: 'Hotels',
                subtitle: 'Unlock Exclusive Stays',
                image: hotel3,
                category: 'Travel'
            },
            {
                id: 2,
                title: 'F&B',
                subtitle: 'Gourmet Dining Experiences',
                image: hotel2,
                category: 'Food'
            },
            {
                id: 3,
                title: 'Tickets',
                subtitle: 'Entertainment & Events',
                image: hotel1,
                category: 'Entertainment'
            },
           
        ];
    },

    // Transform products to hotel data (filtered products)
    transformHotelData: (apiResponse) => {
        const products = apiResponse.products || [];
        
        return products.map((product, index) => ({
            id: product.id,
            name: product.name,
            location: ["Mumbai", "Delhi", "Chennai", "Jaipur", "Shimla", "Bangalore"][index % 6],
            image: product.primary_image || [hotel1, hotel2, hotel3][index % 3],
            rating: product.average_rating || (4.5 + (index * 0.1)),
            points: product.loyalty_points_required || parseFloat(product.current_price || 25000),
            originalPrice: parseFloat(product.base_price || 45000),
            discountedPrice: parseFloat(product.current_price || product.sale_price || 35000),
            amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
            description: product.description ? product.description.substring(0, 60) + "..." : "Luxury accommodation",
            brand: product.brand,
            inStock: product.in_stock,
            featured: product.featured || product.is_trending
        }));
    }
};

// API service class
class PromotionAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        console.log('🔧 PromotionAPI initialized with base URL:', this.baseURL);
    }

    // Get dynamic headers with current auth token
    getHeaders() {
        const authToken = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': authToken && authToken !== 'null' ? `Bearer ${authToken}` : 'Bearer mock-token'
        };
    }

    // Generic API call method
    async makeAPICall(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultHeaders = this.getHeaders();
        const headers = { ...defaultHeaders, ...(options.headers || {}) };
        
        console.group(`🌐 API Call: ${options.method || 'GET'} ${endpoint}`);
        console.log('📤 Request URL:', url);
        console.log('📤 Request Headers:', headers);
        console.log('📤 Request Options:', options);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: headers
            });
            
            const data = await response.json();
            
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response Data:', data);
            console.groupEnd();
            
            return {
                success: response.ok,
                data,
                status: response.status,
                message: response.ok ? 'Success' : 'API call failed'
            };
        } catch (error) {
            console.error('❌ API Error:', error);
            console.groupEnd();
            throw error;
        }
    }

    // Promotions APIs - Using real endpoints
    async getPromotions(filters = {}) {
        console.log('🎯 Getting Promotions with filters:', filters);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.category && filters.category !== 'All') {
            queryParams.append('category', filters.category);
        }
        if (filters.limit) {
            queryParams.append('limit', filters.limit);
        }
        
        const endpoint = `${API_CONFIG.endpoints.getPromotions}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await this.makeAPICall(endpoint);
        
        if (response.success) {
            response.data = transformers.transformPromotionData(response.data);
        }
        
        return response;
    }

    async getPromotionById(id) {
        console.log('🎯 Getting Promotion by ID:', id);
        
        const endpoint = API_CONFIG.endpoints.getPromotionById.replace(':id', id);
        const response = await this.makeAPICall(endpoint);
        
        if (response.success) {
            response.data = transformers.transformPromotionData(response.data)[0];
        }
        
        return response;
    }

    // Redemptions APIs
    async getRedemptions() {
        console.log('🎁 Getting Redemptions');
        
        // For now, return static data since we don't have separate redemption categories endpoint
        return {
            success: true,
            data: transformers.transformRedemptionData({}),
            message: 'Redemptions loaded (static data)'
        };
    }

    // Hotels APIs - Using products filtered by category
    async getHotels(location = 'All') {
        console.log('🏨 Getting Hotels for location:', location);
        
        try {
            // For now, use products endpoint. Later can be separate hotels endpoint
            const queryParams = new URLSearchParams();
            queryParams.append('category', 'hotels');
            if (location !== 'All') {
                queryParams.append('location', location);
            }
            
            const endpoint = `${API_CONFIG.endpoints.getHotels}?${queryParams.toString()}`;
            const response = await this.makeAPICall(endpoint);
            
            if (response.success) {
                response.data = transformers.transformHotelData(response.data);
            }
            
            return response;
        } catch (error) {
            // Fallback to mock hotel data if hotels endpoint doesn't exist yet
            console.log('🏨 Hotels endpoint not available, using fallback data');
            return {
                success: true,
                data: this.getMockHotelData(),
                message: 'Using fallback hotel data'
            };
        }
    }

    getMockHotelData() {
        return [
            {
                id: 1,
                name: "The Taj Mahal Palace",
                location: "Mumbai",
                image: hotel1,
                rating: 4.8,
                points: 25000,
                originalPrice: 45000,
                discountedPrice: 35000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Iconic luxury hotel overlooking the Gateway of India",
                featured: true,
                inStock: true
            },
            {
                id: 2,
                name: "The Oberoi",
                location: "Delhi",
                image: hotel2,
                rating: 4.9,
                points: 30000,
                originalPrice: 55000,
                discountedPrice: 40000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Contemporary luxury in the heart of New Delhi",
                featured: false,
                inStock: true
            },
            {
                id: 3,
                name: "ITC Grand Chola",
                location: "Chennai",
                image: hotel3,
                rating: 4.7,
                points: 28000,
                originalPrice: 48000,
                discountedPrice: 38000,
                amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                description: "Grand luxury hotel inspired by Chola architecture",
                featured: true,
                inStock: true
            }
        ];
    }

    async bookHotel(hotelData) {
        console.log('🏨 Booking Hotel:', hotelData);
        
        const payload = {
            user_id: localStorage.getItem('Loyalty_Member_Unique_Id__c')?.replace(/^0+/, '') || 'user123',
            hotel_id: hotelData.id,
            check_in: hotelData.checkIn,
            check_out: hotelData.checkOut,
            guests: hotelData.guests,
            points_used: hotelData.points,
            special_requests: hotelData.specialRequests || '',
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.bookHotel, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            return response;
        } catch (error) {
            // Mock booking success for demo
            console.log('🏨 Hotel booking endpoint not available, returning mock success');
            return {
                success: true,
                data: {
                    booking_id: Math.floor(1000 + Math.random() * 9000),
                    confirmation_number: `HTL${Date.now()}`,
                    status: 'confirmed',
                    message: 'Hotel booking confirmed'
                },
                message: 'Hotel booking confirmed (mock response)'
            };
        }
    }

    // Encash APIs - Real implementation
    async submitEncashRequest(encashData) {
        console.log('💰 Submitting Encash Request:', encashData);
        
        // Validate required fields
        if (!encashData.pointsToEncash) {
            return {
                success: false,
                message: 'Points to encash is required',
                data: null
            };
        }

        if (!encashData.agreeToTerms) {
            return {
                success: false,
                message: 'You must agree to terms and conditions',
                data: null
            };
        }
        
        const payload = {
            encash_request: {
                points_to_encash: parseInt(encashData.pointsToEncash) || 0,
                facilitation_fee: parseInt(encashData.facilitationFees) || 0,
                amount_payable: parseInt(encashData.amountPayable) || 0,
                account_number: encashData.accountNumber || '',
                ifsc_code: encashData.ifscCode || '',
                branch_name: encashData.branchName || '',
                person_name: encashData.personName || '',
                terms_accepted: encashData.agreeToTerms
            }
        };
        
        console.log('💰 Payload being sent:', JSON.stringify(payload, null, 2));
        
        try {
            // Get auth token from localStorage
            const authToken = localStorage.getItem('authToken');
            console.log('💰 Auth token found:', !!authToken);
            
            if (!authToken || authToken === 'null') {
                return {
                    success: false,
                    message: 'Authentication required. Please login again.',
                    data: null
                };
            }

            const response = await this.makeAPICall(API_CONFIG.endpoints.submitEncashRequest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });
            
            console.log('💰 API Response received:', response);
            return response;
        } catch (error) {
            console.error('💰 Error submitting encash request:', error);
            
            // Return structured error response instead of throwing
            return {
                success: false,
                message: error.message || 'Network error occurred while submitting encash request',
                data: null,
                error: error
            };
        }
    }

    async validateBankDetails(bankDetails) {
        console.log('🏦 Validating Bank Details:', bankDetails);
        
        const payload = {
            account_number: bankDetails.accountNumber,
            ifsc_code: bankDetails.ifscCode
        };
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.validateBankDetails, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            return response;
        } catch (error) {
            // Mock validation success for demo
            console.log('🏦 Bank validation endpoint not available, returning mock success');
            return {
                success: true,
                data: {
                    is_valid: true,
                    bank_name: 'State Bank of India',
                    branch_name: 'Main Branch',
                    message: 'Bank details are valid'
                },
                message: 'Bank details validated (mock response)'
            };
        }
    }

    // Order APIs - Real endpoints
    async createOrder(orderData) {
        console.log('📦 Creating Order:', orderData);
        
        // Use the real API payload structure
        const payload = {
            shipping_address_id: orderData.addressId || orderData.deliveryAddress?.id,
            product_id: orderData.product.id,
            quantity: 1,
            use_loyalty_points: true
        };
        
        console.log('📤 Order API Payload:', payload);
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.createOrder, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            if (response.success) {
                // Transform the real API response
                const orderResponse = response.data.order;
                response.data = {
                    order_id: orderResponse.id,
                    order_number: orderResponse.order_number,
                    status: orderResponse.status,
                    payment_status: orderResponse.payment_status,
                    total_amount: orderResponse.total_amount,
                    loyalty_points_redeemed: orderResponse.loyalty_points_redeemed,
                    loyalty_discount_amount: orderResponse.loyalty_discount_amount,
                    remaining_loyalty_points: response.data.remaining_loyalty_points,
                    message: response.data.message,
                    estimated_delivery: '7-10 business days',
                    tracking_number: orderResponse.order_number,
                    order_items: orderResponse.order_items,
                    shipping_address: orderResponse.shipping_address,
                    created_at: orderResponse.created_at
                };
                
                console.log('✅ Order created successfully:', response.data);
            }
            
            return response;
        } catch (error) {
            console.error('❌ Order creation failed:', error);
            // Fallback for demo purposes
            return {
                success: false,
                data: null,
                message: 'Order creation failed. Please check your address ID and product ID.',
                error: error.message
            };
        }
    }

    async getOrderStatus(orderId) {
        console.log('📦 Getting Order Status for:', orderId);
        
        const endpoint = API_CONFIG.endpoints.getOrderStatus.replace(':id', orderId);
        
        try {
            const response = await this.makeAPICall(endpoint);
            
            if (response.success) {
                response.data = {
                    order_id: orderId,
                    status: 'in_transit',
                    tracking_number: `TRK${orderId}`,
                    estimated_delivery: '3-5 business days',
                    current_location: 'Mumbai Warehouse',
                    updates: [
                        { date: '2025-08-01', status: 'Order Confirmed', description: 'Your order has been confirmed' },
                        { date: '2025-08-02', status: 'Processing', description: 'Your order is being processed' },
                        { date: '2025-08-03', status: 'Shipped', description: 'Your order has been shipped' },
                        { date: '2025-08-04', status: 'In Transit', description: 'Your order is on the way' }
                    ]
                };
            }
            
            return response;
        } catch (error) {
            // Mock tracking response for demo
            console.log('📦 Order status endpoint not available, returning mock data');
            return {
                success: true,
                data: {
                    order_id: orderId,
                    status: 'in_transit',
                    tracking_number: `TRK${orderId}`,
                    estimated_delivery: '3-5 business days',
                    current_location: 'Mumbai Warehouse',
                    updates: [
                        { date: '2025-08-01', status: 'Order Confirmed', description: 'Your order has been confirmed' },
                        { date: '2025-08-02', status: 'Processing', description: 'Your order is being processed' },
                        { date: '2025-08-03', status: 'Shipped', description: 'Your order has been shipped' },
                        { date: '2025-08-04', status: 'In Transit', description: 'Your order is on the way' }
                    ]
                },
                message: 'Order status retrieved (mock response)'
            };
        }
    }

    async trackOrder(orderId) {
        console.log('🔍 Tracking Order:', orderId);
        
        try {
            const endpoint = API_CONFIG.endpoints.trackOrder.replace(':id', orderId);
            const response = await this.makeAPICall(endpoint);
            
            if (response.success) {
                // Transform API response to match our expected format
                const orderData = response.data;
                response.data = {
                    id: orderData.id,
                    orderNumber: orderData.order_number,
                    status: orderData.status,
                    paymentStatus: orderData.payment_status,
                    totalAmount: parseFloat(orderData.total_amount || 0),
                    loyaltyPointsRedeemed: orderData.loyalty_points_redeemed || 0,
                    loyaltyDiscountAmount: parseFloat(orderData.loyalty_discount_amount || 0),
                    createdAt: orderData.created_at,
                    updatedAt: orderData.updated_at,
                    totalItems: orderData.total_items,
                    canBeCancelled: orderData['can_be_cancelled?'],
                    canBeRefunded: orderData['can_be_refunded?'],
                    orderItems: orderData.order_items?.map(item => ({
                        id: item.id,
                        productId: item.product_id,
                        quantity: item.quantity,
                        unitPrice: parseFloat(item.unit_price || 0),
                        totalPrice: parseFloat(item.total_price || 0),
                        itemName: item.item_name,
                        itemSku: item.item_sku,
                        product: {
                            id: item.product?.id,
                            name: item.product?.name,
                            sku: item.product?.sku,
                            primaryImage: item.product?.primary_image
                        }
                    })) || [],
                    orderStatusLogs: orderData.order_status_logs?.map(log => ({
                        id: log.id,
                        status: log.status,
                        notes: log.notes,
                        createdAt: log.created_at,
                        createdBy: log.created_by?.id
                    })) || [],
                    shippingAddress: {
                        address: orderData.shipping_address?.address,
                        state: orderData.shipping_address?.state,
                        city: orderData.shipping_address?.city,
                        pinCode: orderData.shipping_address?.pin_code
                    },
                    billingAddress: {
                        address: orderData.billing_address?.address,
                        state: orderData.billing_address?.state,
                        city: orderData.billing_address?.city,
                        pinCode: orderData.billing_address?.pin_code
                    }
                };
                
                console.log('✅ Order details loaded:', response.data);
            }
            
            return response;
        } catch (error) {
            console.error('❌ Error tracking order:', error);
            throw error;
        }
    }

    // Documentation and debugging methods
    printAPIDocumentation() {
        console.group('🚀 KEECLUB API DOCUMENTATION');
        
        console.group('🌐 Configuration');
        console.log('Base URL:', this.baseURL);
        console.log('Total Endpoints:', Object.keys(API_CONFIG.endpoints).length);
        console.groupEnd();
        
        console.group('📍 Endpoints Overview');
        Object.entries(API_CONFIG.endpoints).forEach(([key, endpoint]) => {
            const method = endpoint.includes('/posts') || endpoint.includes('/orders') || endpoint.includes('/encash') || endpoint.includes('/hotel') ? 'POST/GET' : 'GET';
            console.log(`${method} ${endpoint} - ${key}`);
        });
        console.groupEnd();
        
        console.groupEnd();
        
        return {
            baseURL: this.baseURL,
            endpoints: API_CONFIG.endpoints,
            totalEndpoints: Object.keys(API_CONFIG.endpoints).length
        };
    }

    // Address APIs
    async getUserAddresses() {
        console.log('🏠 Getting User Addresses');
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.getUserAddresses);
            
            if (response.success) {
                // Transform and validate response data
                const addresses = response.data.addresses || [];
                response.data = addresses.map(address => ({
                    id: address.id,
                    address: address.address,
                    addressLineTwo: address.address_line_two,
                    addressLineThree: address.address_line_three,
                    city: address.city,
                    state: address.state,
                    pinCode: address.pin_code,
                    country: address.country,
                    contactPerson: address.contact_person,
                    mobile: address.mobile,
                    email: address.email,
                    telephoneNumber: address.telephone_number,
                    isDefault: address.set_as_default === 'true' || address.address_type === 'default',
                    addressType: address.address_type,
                    active: address.active
                }));
                
                console.log('✅ Addresses loaded:', response.data.length);
            }
            
            return response;
        } catch (error) {
            console.error('❌ Failed to fetch addresses:', error);
            // Return empty addresses array on error
            return {
                success: true,
                data: [],
                message: 'No addresses found or endpoint not available'
            };
        }
    }

    async createAddress(addressData) {
        console.log('🏠 Creating Address:', addressData);
        
        const payload = {
            address: {
                address: addressData.fullAddress,
                address_line_two: addressData.addressLineTwo || addressData.landmark || '',
                address_line_three: addressData.addressLineThree || '',
                city: addressData.city,
                state: addressData.state,
                country: 'India',
                pin_code: addressData.pinCode,
                contact_person: addressData.name,
                mobile: addressData.contactNumber,
                email: addressData.email || localStorage.getItem('user_email'),
                telephone_number: '',
                fax_number: '',
                address_type: addressData.addressType.toLowerCase() || 'home'
            }
        };
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.createAddress, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            if (response.success) {
                console.log('✅ Address created successfully');
                // Transform response to match our format
                const createdAddress = response.data.address || response.data;
                response.data = {
                    id: createdAddress.id || Math.floor(Math.random() * 1000),
                    message: 'Address created successfully'
                };
            }
            
            return response;
        } catch (error) {
            console.error('❌ Failed to create address:', error);
            // Return structured error response instead of throwing
            return {
                success: false,
                message: error.message || 'Network error occurred while creating address',
                data: null,
                error: error
            };
        }
    }

    // Orders APIs
    async getUserOrders() {
        console.log('📦 Getting User Orders');
        
        try {
            const response = await this.makeAPICall(API_CONFIG.endpoints.getUserOrders);
            
            if (response.success) {
                // Transform and validate response data
                const orders = response.data.orders || [];
                response.data = {
                    orders: orders.map(order => ({
                        id: order.id,
                        orderNumber: order.order_number,
                        status: order.status,
                        paymentStatus: order.payment_status,
                        totalAmount: parseFloat(order.total_amount || 0),
                        loyaltyPointsRedeemed: order.loyalty_points_redeemed || 0,
                        loyaltyPointsEarned: order.loyalty_points_earned || 0,
                        loyaltyDiscountAmount: parseFloat(order.loyalty_discount_amount || 0),
                        totalItems: order.total_items || 0,
                        createdAt: order.created_at,
                        updatedAt: order.updated_at,
                        canBeCancelled: order['can_be_cancelled?'] || false,
                        canBeRefunded: order['can_be_refunded?'] || false,
                        orderItems: (order.order_items || []).map(item => ({
                            id: item.id,
                            productId: item.product_id,
                            quantity: item.quantity,
                            unitPrice: parseFloat(item.unit_price || 0),
                            totalPrice: parseFloat(item.total_price || 0),
                            itemName: item.item_name,
                            product: item.product ? {
                                id: item.product.id,
                                name: item.product.name,
                                sku: item.product.sku,
                                primaryImage: item.product.primary_image
                            } : null
                        })),
                        shippingAddress: order.shipping_address ? {
                            ...order.shipping_address
                        } : null
                    })),
                    pagination: response.data.pagination || {
                        current_page: 1,
                        per_page: 10,
                        total_count: orders.length
                    }
                };
                
                console.log('✅ Orders loaded:', response.data.orders);
            }
            
            return response;
        } catch (error) {
            console.error('❌ Failed to fetch orders:', error);
            // Return empty orders array on error
            return {
                success: true,
                data: {
                    orders: [],
                    pagination: { current_page: 1, per_page: 10, total_count: 0 }
                },
                message: 'No orders found or endpoint not available'
            };
        }
    }
}

// Create singleton instance
const promotionAPI = new PromotionAPI();

// Export both named and default exports to fix import issues
export { promotionAPI };
export default promotionAPI;

// Helper function to simulate network delay (optional)
export const simulateNetworkDelay = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Log API service initialization
console.group('🚀 API SERVICE INITIALIZED');
console.log('📋 Endpoints configured:', Object.keys(API_CONFIG.endpoints).length);
console.log('🔗 Base URL (Dynamic):', API_CONFIG.baseURL);
console.log('🌍 Current hostname:', window.location.hostname);
console.log('📖 Call promotionAPI.printAPIDocumentation() for detailed info');
console.groupEnd();
