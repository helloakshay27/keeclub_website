// Mock API configuration
const API_CONFIG = {
    baseURL: 'https://jsonplaceholder.typicode.com', // Using JSONPlaceholder as mock API
    // REAL API BASE URL WILL BE: 'https://api.keeclub.com/v1'
    
    endpoints: {
        // Promotions Module
        getPromotions: '/posts', // REAL: GET /promotions?category={category}&limit={limit}
        getPromotionById: '/posts/:id', // REAL: GET /promotions/{id}
        
        // Redemptions Module
        getRedemptions: '/users', // REAL: GET /redemptions/categories?category={category}
        getRedemptionCategories: '/albums', // REAL: GET /redemptions/categories
        
        // Encash Module
        submitEncashRequest: '/posts', // REAL: POST /encash/request
        validateBankDetails: '/posts', // REAL: POST /encash/validate-bank
        getEncashHistory: '/posts', // REAL: GET /encash/history?userId={userId}
        
        // Hotels Module
        getHotels: '/comments', // REAL: GET /hotels?location={location}&category={category}
        getHotelById: '/comments/:id', // REAL: GET /hotels/{id}
        bookHotel: '/posts', // REAL: POST /hotels/book
        getHotelBookings: '/posts', // REAL: GET /hotels/bookings?userId={userId}
        
        // Orders Module
        createOrder: '/posts', // REAL: POST /orders/create
        getOrderStatus: '/posts/:id', // REAL: GET /orders/{orderId}/status
        trackOrder: '/posts/:id', // REAL: GET /orders/{orderId}/track
        getOrderHistory: '/posts', // REAL: GET /orders/history?userId={userId}
        
        // User Module
        getUserProfile: '/users/1', // REAL: GET /users/{userId}/profile
        getUserPoints: '/users/1', // REAL: GET /users/{userId}/points
        updateUserProfile: '/users/1' // REAL: PUT /users/{userId}/profile
    }
};

/*
=======================================================================
API PAYLOAD AND RESPONSE MAPPING FOR BACKEND DEVELOPER
=======================================================================

1. PROMOTIONS MODULE
-------------------

GET /promotions
Query Parameters:
- category: string (optional) - Filter by category (Luxury, Premium, etc.)
- limit: number (optional) - Number of results to return
- offset: number (optional) - Pagination offset

Response Structure:
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": string,
      "title": string,
      "currentPrice": number,
      "originalPrice": number,
      "points": number,
      "image": string,
      "category": string,
      "featured": boolean,
      "description": string,
      "availability": string,
      "specifications": object
    }
  ],
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  }
}

GET /promotions/{id}
Response Structure: Single promotion object from above array

2. REDEMPTIONS MODULE
--------------------

GET /redemptions/categories
Query Parameters:
- category: string (optional) - Filter by category

Response Structure:
{
  "success": true,
  "data": [
    {
      "id": number,
      "title": string,
      "subtitle": string,
      "image": string,
      "category": string,
      "pointsRange": {
        "min": number,
        "max": number
      },
      "availableItems": number
    }
  ]
}

3. ENCASH MODULE
---------------

POST /encash/request
Request Payload:
{
  "userId": string,
  "pointsToEncash": number,
  "facilitationFees": number,
  "amountPayable": number,
  "bankDetails": {
    "accountNumber": string,
    "ifscCode": string,
    "branchName": string,
    "personName": string
  },
  "agreeToTerms": boolean,
  "timestamp": string (ISO 8601)
}

Response Structure:
{
  "success": true,
  "data": {
    "requestId": string,
    "status": "pending" | "approved" | "rejected",
    "estimatedProcessingTime": string,
    "transactionId": string
  }
}

POST /encash/validate-bank
Request Payload:
{
  "accountNumber": string,
  "ifscCode": string
}

Response Structure:
{
  "success": true,
  "data": {
    "valid": boolean,
    "bankName": string,
    "branchName": string,
    "accountType": string
  }
}

4. HOTELS MODULE
---------------

GET /hotels
Query Parameters:
- location: string (optional) - Filter by location
- category: string (optional) - Filter by category
- priceRange: string (optional) - Filter by price range

Response Structure:
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": string,
      "location": string,
      "image": string,
      "rating": number,
      "points": number,
      "originalPrice": number,
      "discountedPrice": number,
      "amenities": string[],
      "description": string,
      "availability": boolean,
      "roomTypes": object[]
    }
  ]
}

POST /hotels/book
Request Payload:
{
  "hotelId": number,
  "userId": string,
  "checkIn": string (YYYY-MM-DD),
  "checkOut": string (YYYY-MM-DD),
  "guests": number,
  "roomType": string,
  "pointsUsed": number,
  "specialRequests": string,
  "timestamp": string (ISO 8601)
}

Response Structure:
{
  "success": true,
  "data": {
    "bookingId": string,
    "confirmationNumber": string,
    "status": "confirmed" | "pending" | "cancelled",
    "checkIn": string,
    "checkOut": string,
    "totalAmount": number,
    "pointsUsed": number
  }
}

5. ORDERS MODULE
---------------

POST /orders/create
Request Payload:
{
  "userId": string,
  "productId": number,
  "pointsUsed": number,
  "deliveryAddress": {
    "name": string,
    "contactNumber": string,
    "pinCode": string,
    "city": string,
    "state": string,
    "landmark": string,
    "fullAddress": string,
    "addressType": "Home" | "Office"
  },
  "orderType": "product_redemption" | "hotel_booking",
  "timestamp": string (ISO 8601)
}

Response Structure:
{
  "success": true,
  "data": {
    "orderId": string,
    "status": "confirmed" | "processing" | "shipped" | "delivered",
    "estimatedDelivery": string,
    "trackingNumber": string,
    "totalAmount": number,
    "pointsUsed": number
  }
}

GET /orders/{orderId}/track
Response Structure:
{
  "success": true,
  "data": {
    "orderId": string,
    "status": "confirmed" | "processing" | "shipped" | "in_transit" | "delivered",
    "trackingNumber": string,
    "estimatedDelivery": string,
    "currentLocation": string,
    "updates": [
      {
        "date": string,
        "status": string,
        "description": string,
        "location": string
      }
    ]
  }
}

6. ERROR RESPONSES
-----------------

All endpoints should return error responses in this format:
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": object (optional)
  }
}

7. AUTHENTICATION
-----------------

All API requests should include:
Headers:
- Authorization: Bearer {token}
- Content-Type: application/json

=======================================================================
*/

// Mock data transformers
const transformers = {
    // Transform mock data to our promotion structure
    transformPromotionData: (mockData) => {
        return mockData.slice(0, 5).map((item, index) => ({
            id: item.id,
            name: ["Tissot Watch", "Longines Conquest", "Rolex Yacht-Master", "Omega Speedmaster", "Rolex Deepsea Challenge"][index] || "Luxury Watch",
            title: item.title.substring(0, 50) + "...",
            currentPrice: 65000 + (index * 30000),
            originalPrice: 85000 + (index * 35000),
            points: 65000 + (index * 30000),
            image: `/src/assets/Hotel/Card${(index % 3) + 1}.png`,
            category: index % 2 === 0 ? "Luxury" : "Premium",
            featured: index % 3 === 0,
            description: item.body.substring(0, 50) + "..."
        }));
    },

    transformRedemptionData: (mockData) => {
        return mockData.slice(0, 6).map((item, index) => ({
            id: item.id,
            title: ["Hotels", "F&B", "Tickets", "Shopping", "Experience", "Services"][index],
            subtitle: "Unlock Exclusive Stays",
            image: `/src/assets/Hotel/${index < 3 ? `hotel${index + 1}.jpg` : `Card${((index - 3) % 3) + 1}.png`}`,
            category: ["Travel", "Food", "Entertainment", "Shopping", "Experience", "Services"][index]
        }));
    },

    transformHotelData: (mockData) => {
        return mockData.slice(0, 6).map((item, index) => ({
            id: item.id,
            name: ["The Taj Mahal Palace", "The Oberoi", "ITC Grand Chola", "Rambagh Palace", "Wildflower Hall", "Leela Palace"][index],
            location: ["Mumbai", "Delhi", "Chennai", "Jaipur", "Shimla", "Bangalore"][index],
            image: `/src/assets/Hotel/${index < 3 ? `hotel${index + 1}.jpg` : `Card${((index - 3) % 3) + 1}.png`}`,
            rating: 4.5 + (index * 0.1),
            points: 25000 + (index * 5000),
            originalPrice: 45000 + (index * 10000),
            discountedPrice: 35000 + (index * 8000),
            amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
            description: item.body.substring(0, 60) + "..."
        }));
    }
};

// API service class
class PromotionAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || 'mock-token'}`
        };
    }

    // Generic API call method with comprehensive logging
    async makeAPICall(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        
        // Enhanced console logging for backend developers
        console.group(`🌐 API Call: ${method} ${endpoint}`);
        console.log('📍 Endpoint Mapping:', {
            mockEndpoint: endpoint,
            realEndpoint: this.getRealEndpoint(endpoint, method),
            method: method
        });
        console.log('📤 Request URL:', url);
        console.log('📤 Request Headers:', this.defaultHeaders);
        
        if (options.body) {
            console.log('📤 Request Payload:', JSON.parse(options.body));
            console.log('📋 Payload Structure for Backend:', this.getPayloadStructure(endpoint, method));
        }
        
        console.log('⏱️ Request Timestamp:', new Date().toISOString());
        
        try {
            const response = await fetch(url, {
                headers: this.defaultHeaders,
                ...options
            });
            
            const data = await response.json();
            
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
            console.log('📥 Response Data:', data);
            console.log('📋 Expected Response Structure:', this.getResponseStructure(endpoint, method));
            console.log('⏱️ Response Timestamp:', new Date().toISOString());
            console.groupEnd();
            
            return {
                success: response.ok,
                data,
                status: response.status,
                message: response.ok ? 'Success' : 'API call failed'
            };
        } catch (error) {
            console.error('❌ API Error:', error);
            console.log('📋 Error Response Structure:', {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: error.message,
                    details: error
                }
            });
            console.groupEnd();
            throw error;
        }
    }

    // Helper method to map mock endpoints to real endpoints
    getRealEndpoint(mockEndpoint, method) {
        const mapping = {
            '/posts': {
                'GET': '/promotions',
                'POST': '/orders/create'
            },
            '/users': {
                'GET': '/redemptions/categories'
            },
            '/comments': {
                'GET': '/hotels'
            }
        };
        
        const baseEndpoint = mockEndpoint.split('/')[1];
        return mapping[`/${baseEndpoint}`]?.[method] || mockEndpoint;
    }

    // Helper method to provide payload structure documentation
    getPayloadStructure(endpoint, method) {
        const structures = {
            '/posts': {
                'POST': {
                    encashRequest: {
                        userId: 'string',
                        pointsToEncash: 'number',
                        facilitationFees: 'number',
                        amountPayable: 'number',
                        bankDetails: {
                            accountNumber: 'string',
                            ifscCode: 'string',
                            branchName: 'string',
                            personName: 'string'
                        },
                        agreeToTerms: 'boolean',
                        timestamp: 'string (ISO 8601)'
                    },
                    orderCreate: {
                        userId: 'string',
                        productId: 'number',
                        pointsUsed: 'number',
                        deliveryAddress: 'object',
                        orderType: 'string',
                        timestamp: 'string (ISO 8601)'
                    },
                    hotelBooking: {
                        hotelId: 'number',
                        userId: 'string',
                        checkIn: 'string (YYYY-MM-DD)',
                        checkOut: 'string (YYYY-MM-DD)',
                        guests: 'number',
                        pointsUsed: 'number',
                        timestamp: 'string (ISO 8601)'
                    }
                }
            }
        };
        
        return structures[endpoint]?.[method] || 'No structure defined';
    }

    // Helper method to provide response structure documentation
    getResponseStructure(endpoint, method) {
        const structures = {
            '/posts': {
                'GET': {
                    success: 'boolean',
                    data: 'array of promotion objects',
                    pagination: 'object'
                },
                'POST': {
                    success: 'boolean',
                    data: {
                        orderId: 'string',
                        status: 'string',
                        estimatedDelivery: 'string'
                    }
                }
            },
            '/users': {
                'GET': {
                    success: 'boolean',
                    data: 'array of redemption category objects'
                }
            },
            '/comments': {
                'GET': {
                    success: 'boolean',
                    data: 'array of hotel objects'
                }
            }
        };
        
        return structures[endpoint]?.[method] || 'No structure defined';
    }

    // Promotions APIs
    async getPromotions(filters = {}) {
        console.log('🎯 Getting Promotions with filters:', filters);
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.getPromotions);
        
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
            // Transform single promotion data
            response.data = transformers.transformPromotionData([response.data])[0];
        }
        
        return response;
    }

    // Redemptions APIs
    async getRedemptions(category = 'All') {
        console.log('🎁 Getting Redemptions for category:', category);
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.getRedemptions);
        
        if (response.success) {
            response.data = transformers.transformRedemptionData(response.data);
        }
        
        return response;
    }

    // Hotels APIs
    async getHotels(location = 'All') {
        console.log('🏨 Getting Hotels for location:', location);
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.getHotels);
        
        if (response.success) {
            response.data = transformers.transformHotelData(response.data);
        }
        
        return response;
    }

    async bookHotel(hotelData) {
        console.log('🏨 Booking Hotel:', hotelData);
        
        const payload = {
            hotelId: hotelData.id,
            userId: localStorage.getItem('member_id'),
            checkIn: hotelData.checkIn,
            checkOut: hotelData.checkOut,
            guests: hotelData.guests,
            pointsUsed: hotelData.points,
            timestamp: new Date().toISOString()
        };
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.bookHotel, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        return response;
    }

    // Encash APIs
    async submitEncashRequest(encashData) {
        console.log('💰 Submitting Encash Request:', encashData);
        
        const payload = {
            userId: localStorage.getItem('member_id'),
            pointsToEncash: encashData.pointsToEncash,
            facilitationFees: encashData.facilitationFees,
            amountPayable: encashData.amountPayable,
            bankDetails: {
                accountNumber: encashData.accountNumber,
                ifscCode: encashData.ifscCode,
                branchName: encashData.branchName,
                personName: encashData.personName
            },
            agreeToTerms: encashData.agreeToTerms,
            timestamp: new Date().toISOString()
        };
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.submitEncashRequest, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        return response;
    }

    async validateBankDetails(bankDetails) {
        console.log('🏦 Validating Bank Details:', bankDetails);
        
        const payload = {
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode
        };
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.validateBankDetails, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        return response;
    }

    // Order APIs
    async createOrder(orderData) {
        console.log('📦 Creating Order:', orderData);
        
        const payload = {
            userId: localStorage.getItem('member_id'),
            productId: orderData.product.id,
            pointsUsed: orderData.product.points,
            deliveryAddress: orderData.deliveryAddress,
            orderType: orderData.orderType,
            timestamp: new Date().toISOString()
        };
        
        const response = await this.makeAPICall(API_CONFIG.endpoints.createOrder, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        if (response.success) {
            response.data = {
                orderId: Math.floor(1000 + Math.random() * 9000),
                status: 'confirmed',
                estimatedDelivery: '7-10 business days'
            };
        }
        
        return response;
    }

    async getOrderStatus(orderId) {
        console.log('📦 Getting Order Status for:', orderId);
        
        const endpoint = API_CONFIG.endpoints.getOrderStatus.replace(':id', orderId);
        const response = await this.makeAPICall(endpoint);
        
        if (response.success) {
            response.data = {
                orderId,
                status: 'in_transit',
                trackingNumber: `TRK${orderId}`,
                estimatedDelivery: '3-5 business days',
                updates: [
                    { date: '2025-01-30', status: 'Order Confirmed', description: 'Your order has been confirmed' },
                    { date: '2025-01-31', status: 'Processing', description: 'Your order is being processed' },
                    { date: '2025-02-01', status: 'Shipped', description: 'Your order has been shipped' },
                    { date: '2025-02-02', status: 'In Transit', description: 'Your order is on the way' }
                ]
            };
        }
        
        return response;
    }

    async trackOrder(orderId) {
        console.log('🔍 Tracking Order:', orderId);
        
        return this.getOrderStatus(orderId);
    }

    // Utility method for backend developers - Print all API mappings
    printAPIDocumentation() {
        console.group('📚 COMPLETE API ENDPOINT MAPPING FOR BACKEND DEVELOPER');
        
        const realEndpoints = {
            // Promotions
            'GET /promotions': {
                description: 'Get list of promotions with optional filtering',
                queryParams: ['category', 'limit', 'offset'],
                mockEndpoint: 'GET /posts',
                sampleResponse: {
                    success: true,
                    data: [
                        {
                            id: 1,
                            name: 'Tissot Watch',
                            title: 'Tissot T-Race MotoGP',
                            currentPrice: 65000,
                            originalPrice: 85000,
                            points: 65000,
                            image: 'string',
                            category: 'Luxury',
                            featured: true,
                            description: 'string'
                        }
                    ]
                }
            },
            'GET /promotions/{id}': {
                description: 'Get specific promotion details',
                pathParams: ['id'],
                mockEndpoint: 'GET /posts/{id}',
                sampleResponse: 'Single promotion object'
            },
            // Redemptions
            'GET /redemptions/categories': {
                description: 'Get redemption categories',
                queryParams: ['category'],
                mockEndpoint: 'GET /users',
                sampleResponse: {
                    success: true,
                    data: [
                        {
                            id: 1,
                            title: 'Hotels',
                            subtitle: 'Unlock Exclusive Stays',
                            image: 'string',
                            category: 'Travel'
                        }
                    ]
                }
            },
            // Encash
            'POST /encash/request': {
                description: 'Submit encash request',
                mockEndpoint: 'POST /posts',
                samplePayload: {
                    userId: 'string',
                    pointsToEncash: 50000,
                    facilitationFees: 1000,
                    amountPayable: 49000,
                    bankDetails: {
                        accountNumber: 'string',
                        ifscCode: 'string',
                        branchName: 'string',
                        personName: 'string'
                    },
                    agreeToTerms: true,
                    timestamp: '2025-08-02T10:30:00.000Z'
                },
                sampleResponse: {
                    success: true,
                    data: {
                        requestId: 'ENC123456',
                        status: 'pending',
                        estimatedProcessingTime: '3-5 business days'
                    }
                }
            },
            'POST /encash/validate-bank': {
                description: 'Validate bank details',
                mockEndpoint: 'POST /posts',
                samplePayload: {
                    accountNumber: 'string',
                    ifscCode: 'string'
                },
                sampleResponse: {
                    success: true,
                    data: {
                        valid: true,
                        bankName: 'State Bank of India',
                        branchName: 'Main Branch'
                    }
                }
            },
            // Hotels
            'GET /hotels': {
                description: 'Get list of hotels',
                queryParams: ['location', 'category'],
                mockEndpoint: 'GET /comments',
                sampleResponse: {
                    success: true,
                    data: [
                        {
                            id: 1,
                            name: 'The Taj Mahal Palace',
                            location: 'Mumbai',
                            image: 'string',
                            rating: 4.8,
                            points: 25000,
                            originalPrice: 45000,
                            discountedPrice: 35000,
                            amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
                            description: 'string'
                        }
                    ]
                }
            },
            'POST /hotels/book': {
                description: 'Book a hotel',
                mockEndpoint: 'POST /posts',
                samplePayload: {
                    hotelId: 1,
                    userId: 'string',
                    checkIn: '2025-08-10',
                    checkOut: '2025-08-12',
                    guests: 2,
                    pointsUsed: 25000,
                    timestamp: '2025-08-02T10:30:00.000Z'
                },
                sampleResponse: {
                    success: true,
                    data: {
                        bookingId: 'HTL123456',
                        confirmationNumber: 'CONF789',
                        status: 'confirmed'
                    }
                }
            },
            // Orders
            'POST /orders/create': {
                description: 'Create a new order',
                mockEndpoint: 'POST /posts',
                samplePayload: {
                    userId: 'string',
                    productId: 1,
                    pointsUsed: 65000,
                    deliveryAddress: {
                        name: 'John Doe',
                        contactNumber: '9876543210',
                        pinCode: '400001',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        landmark: 'Near Gateway of India',
                        fullAddress: 'Complete address',
                        addressType: 'Home'
                    },
                    orderType: 'product_redemption',
                    timestamp: '2025-08-02T10:30:00.000Z'
                },
                sampleResponse: {
                    success: true,
                    data: {
                        orderId: 'ORD123456',
                        status: 'confirmed',
                        estimatedDelivery: '7-10 business days',
                        trackingNumber: 'TRK789'
                    }
                }
            },
            'GET /orders/{orderId}/track': {
                description: 'Track order status',
                pathParams: ['orderId'],
                mockEndpoint: 'GET /posts/{id}',
                sampleResponse: {
                    success: true,
                    data: {
                        orderId: 'ORD123456',
                        status: 'in_transit',
                        trackingNumber: 'TRK789',
                        estimatedDelivery: '3-5 business days',
                        updates: [
                            {
                                date: '2025-01-30',
                                status: 'Order Confirmed',
                                description: 'Your order has been confirmed'
                            },
                            {
                                date: '2025-01-31',
                                status: 'Processing',
                                description: 'Your order is being processed'
                            }
                        ]
                    }
                }
            }
        };

        Object.entries(realEndpoints).forEach(([endpoint, details]) => {
            console.group(`🔗 ${endpoint}`);
            console.log('📝 Description:', details.description);
            console.log('🔄 Mock Endpoint:', details.mockEndpoint);
            if (details.queryParams) console.log('📋 Query Parameters:', details.queryParams);
            if (details.pathParams) console.log('📋 Path Parameters:', details.pathParams);
            if (details.samplePayload) console.log('📤 Sample Payload:', details.samplePayload);
            if (details.sampleResponse) console.log('📥 Sample Response:', details.sampleResponse);
            console.groupEnd();
        });

        console.log('');
        console.log('🔐 Authentication Required:');
        console.log('All endpoints require: Authorization: Bearer {token}');
        console.log('');
        console.log('📝 Error Response Format:');
        console.log({
            success: false,
            error: {
                code: 'ERROR_CODE',
                message: 'Error description',
                details: {}
            }
        });
        
        console.groupEnd();
    }
}

// Export singleton instance
export const promotionAPI = new PromotionAPI();

// Export for direct use
export default promotionAPI;

// Helper function to simulate network delay (optional)
export const simulateNetworkDelay = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Print API documentation for backend developers (call this in console)
// promotionAPI.printAPIDocumentation();

console.log('🚀 PromotionAPI Service Loaded - Call promotionAPI.printAPIDocumentation() for complete endpoint mapping');