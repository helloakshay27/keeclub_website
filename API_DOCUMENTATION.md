# 🚀 KEECLUB API Integration Documentation

## 📋 Implementation Summary

### ✅ COMPLETED INTEGRATIONS

1. **REAL API ENDPOINTS** - Currently Working:
   - ✅ `GET /products.json` - Fetching real promotion/product data
   - ✅ `GET /products/{id}.json` - Single product details
   - ✅ Console logging of all API calls with request/response payloads
   - ✅ Network tab visibility for all API calls
   - ✅ Data transformation from real API response to UI format

2. **MOCK API ENDPOINTS** - Ready for Backend Implementation:
   - 🔄 `POST /encash/request` - Encash request submission
   - 🔄 `POST /encash/validate-bank` - Bank details validation  
   - 🔄 `POST /orders` - Order creation
   - 🔄 `GET /orders/{id}` - Order status and tracking
   - 🔄 `POST /hotel/bookings` - Hotel booking with points
   - 🔄 `GET /categories.json` - Redemption categories

---

## 🌐 API CONFIGURATION

**Base URL:** `https://piramal-loyalty-dev.lockated.com`

### 📍 ENDPOINT MAPPING

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/products.json` | GET | Get all promotions/products | ✅ Working |
| `/products/{id}.json` | GET | Get single product details | ✅ Working |
| `/encash/request` | POST | Submit encash request | 🔄 Mock Response |
| `/encash/validate-bank` | POST | Validate bank details | 🔄 Mock Response |
| `/orders` | POST | Create new order | 🔄 Mock Response |
| `/orders/{id}` | GET | Get order status | 🔄 Mock Response |
| `/hotel/bookings` | POST | Book hotel with points | 🔄 Mock Response |
| `/categories.json` | GET | Get redemption categories | 🔄 Static Data |

---

## 📦 PAYLOAD STRUCTURES

### 1. Encash Request (POST /encash/request)
```json
{
  "user_id": "user123",
  "points_to_encash": 50000,
  "facilitation_fees": 1000,
  "amount_payable": 49000,
  "bank_details": {
    "account_number": "1234567890",
    "ifsc_code": "SBIN0001234",
    "branch_name": "Main Branch",
    "account_holder_name": "John Doe"
  },
  "agree_to_terms": true,
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

### 2. Order Creation (POST /orders)
```json
{
  "user_id": "user123",
  "product_id": 1,
  "product_name": "Tissot PRX 40mm",
  "points_used": 74500,
  "delivery_address": {
    "name": "John Doe",
    "contact_number": "+91 9876543210",
    "address_line": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pin_code": "400001",
    "landmark": "Near Station",
    "address_type": "Home"
  },
  "order_type": "product_redemption",
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

### 3. Hotel Booking (POST /hotel/bookings)
```json
{
  "user_id": "user123",
  "hotel_id": 1,
  "check_in": "2025-08-15",
  "check_out": "2025-08-17",
  "guests": 2,
  "points_used": 25000,
  "special_requests": "Late checkout",
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

### 4. Bank Validation (POST /encash/validate-bank)
```json
{
  "account_number": "1234567890",
  "ifsc_code": "SBIN0001234"
}
```

---

## 📥 EXPECTED RESPONSE STRUCTURES

### 1. Encash Response
```json
{
  "success": true,
  "data": {
    "request_id": 1234,
    "status": "submitted",
    "estimated_processing_time": "3-5 business days",
    "message": "Encash request submitted successfully"
  }
}
```

### 2. Order Response
```json
{
  "success": true,
  "data": {
    "order_id": 1234,
    "status": "confirmed",
    "estimated_delivery": "7-10 business days",
    "tracking_number": "TRK1234567890",
    "message": "Order created successfully"
  }
}
```

### 3. Order Tracking Response
```json
{
  "success": true,
  "data": {
    "order_id": 1234,
    "status": "in_transit",
    "tracking_number": "TRK1234567890",
    "estimated_delivery": "3-5 business days",
    "current_location": "Mumbai Warehouse",
    "updates": [
      {
        "date": "2025-08-01",
        "status": "Order Confirmed",
        "description": "Your order has been confirmed"
      },
      {
        "date": "2025-08-02",
        "status": "Processing",
        "description": "Your order is being processed"
      }
    ]
  }
}
```

### 4. Bank Validation Response
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "bank_name": "State Bank of India",
    "branch_name": "Main Branch",
    "message": "Bank details are valid"
  }
}
```

### 5. Product Details Response (Enhanced for Dynamic Tabs)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tissot PRX 40mm",
    "title": "Tissot T137.407.11.351.00",
    "description": "Short product description for listing",
    "longDescription": "Detailed product description for about tab",
    "brand": "TISSOT",
    "modelNumber": "T137.407.11.351.00",
    "current_price": 74500,
    "base_price": 74500,
    "loyalty_points_required": 74500,
    "primary_image": "https://example.com/image1.png",
    "images": [
      "https://example.com/image1.png",
      "https://example.com/image2.png",
      "https://example.com/image3.png"
    ],
    "in_stock": true,
    "rating": 4.5,
    "reviews_count": 127,
    "features": [
      "Powermatic 80 Movement",
      "Swiss Made",
      "Water Resistant up to 100m",
      "Stainless Steel Case"
    ],
    "specifications": {
      "brand": "TISSOT",
      "model": "T137.407.11.351.00",
      "movement": "Powermatic 80",
      "caseSize": "40mm",
      "caseMaterial": "Stainless Steel",
      "dialColor": "Silver",
      "strapType": "Steel Bracelet",
      "waterResistance": "100m",
      "glassType": "Sapphire Crystal",
      "caseThickness": "10.9mm",
      "lugWidth": "20mm"
    },
    "collection": {
      "name": "PRX Collection",
      "description": "Collection description for about tab"
    },
    "designFeatures": "Detailed design and features text",
    "additionalInfo": "Additional information text",
    "warranty": "2 years international warranty",
    "category": "Watches",
    "subcategory": "Luxury Watches"
  }
}
```

---

## 🎯 ENHANCED PRODUCT API FIELDS

### Product Details Response - Enhanced Fields for Tab Design

```json
{
  "id": 1,
  "name": "Tissot T-Race MotoGP",
  "brand": "Tissot",
  "collection": "T-Sport",
  "series": "Tissot T-Race MotoGP™",
  "model_number": "T141.417.27.081.00",
  
  // Content for "About The Collections" tab
  "collection_description": "The T-Sport collection elevates Tissot watches...",
  "design_features": "The T-Sport collection features Tissot watches...",
  "heritage_info": "With over 170 years of Swiss watchmaking excellence...",
  "technical_features": "Advanced Swiss quartz chronograph movement...",
  "innovation_details": "Cutting-edge technology and design...",
  "quality_assurance": "Every Tissot timepiece undergoes rigorous testing...",
  "additional_info": "This timepiece comes with comprehensive warranty...",
  "long_description": "Extended product description for about section",
  
  // Content for "Full Specifications" tab
  "specifications": {
    // Movement specifications
    "movement_features": "Chronograph and Date Display",
    "movement_type": "Quartz",
    "dial_features": "N/A",
    
    // Case specifications  
    "case_size": "45",
    "case_shape": "Round", 
    "case_material": "Stainless Steel",
    
    // Dial specifications
    "dial_color": "Black",
    
    // Strap specifications
    "strap_type": "Silicone",
    "strap_color": "Black"
  },
  
  // Standard product fields
  "current_price": 65500,
  "base_price": 65500,
  "loyalty_points_required": 65000,
  "primary_image": "image_url",
  "all_images": ["image1_url", "image2_url"],
  "description": "Short description for card view",
  "in_stock": true,
  "featured": true
}
```

### 🎨 Tab Design Implementation

The product detail page now features two main tabs:

1. **Full Specifications Tab**
   - Displays product info in 4-column grid layout
   - Brand, Collection, Series, Model Number at top
   - Organized sections: MOVEMENT, CASE, DIAL, STRAP
   - Dynamic field mapping from API response

2. **About The Collections Tab**  
   - Rich content sections with detailed descriptions
   - Heritage & Craftsmanship information
   - Technical Innovation details
   - Quality Assurance information
   - Responsive typography and spacing

### 🔧 API Field Mapping Priority

**High Priority** (Required for proper display):
- `collection_description` - Main content for About tab
- `design_features` - Design section content
- `specifications.*` - All specification fields

**Medium Priority** (Enhanced content):
- `heritage_info` - Heritage section
- `technical_features` - Technical details
- `quality_assurance` - Quality information

**Low Priority** (Fallback content available):
- `innovation_details` - Innovation section
- `additional_info` - Additional information section

---

## 🔧 IMPLEMENTATION DETAILS

### Data Transformation
The API service automatically transforms the real product API response to match the UI requirements:

**Real API Response Fields → UI Fields:**
- `name` → `name`
- `primary_image` → `image`
- `loyalty_points_required` → `points`
- `current_price` → `currentPrice`
- `base_price` → `originalPrice`
- `featured` → `featured`
- `description` → `description` (truncated)

### Console Logging
All API calls are logged with:
- 📤 Request URL and options
- 📥 Response status and data
- 🎯 Method-specific context
- ❌ Error handling and fallbacks

### Network Tab Visibility
All API calls appear in browser Network tab for easy debugging and monitoring.

---

## 🚨 PRIORITY IMPLEMENTATION ORDER

### HIGH PRIORITY
1. **POST /encash/request** - Critical for points encashing
2. **POST /encash/validate-bank** - Ensures valid bank details
3. **POST /orders** - Core order creation functionality
4. **GET /orders/{id}** - Order tracking and status

### MEDIUM PRIORITY
5. **POST /hotel/bookings** - Hotel redemption booking
6. **GET /categories.json** - Dynamic redemption categories

### LOW PRIORITY
7. Separate hotels endpoint (currently using products)
8. Advanced filtering and pagination

---

## 🧪 TESTING

### How to Test
1. Open browser console at `http://localhost:5175`
2. Navigate to Promotions page
3. Check console for API call logs
4. Check Network tab for HTTP requests
5. Test different functionalities:
   - View promotions (real API)
   - Submit encash request (mock)
   - Create orders (mock)
   - Track orders (mock)

### Debug Commands
```javascript
// Print API documentation
promotionAPI.printAPIDocumentation()

// Test specific endpoint
await promotionAPI.getPromotions({ category: 'Luxury' })
```

---

## 📁 FILE STRUCTURE

```
src/
├── services/
│   └── promotionAPI.js          # Main API service
├── Pages/
│   ├── Promotions.jsx          # Real API integration ✅
│   ├── Redemptions.jsx         # Static data (ready for API)
│   ├── Encash.jsx             # Mock API integration
│   ├── HotelsRedemption.jsx   # Mock API integration
│   ├── RedeemPoints.jsx       # Order creation API
│   ├── OrderConfirmation.jsx  # Order creation flow
│   ├── OrderSuccess.jsx       # Success state
│   └── TrackOrder.jsx         # Order tracking API
```

---

## 🎯 NEXT STEPS FOR BACKEND

1. **Implement Priority Endpoints** following exact payload/response structures
2. **Test with Frontend** using provided console logging
3. **Validate Data Types** match expected structures
4. **Handle Error Cases** with appropriate HTTP status codes
5. **Add Authentication** if required (headers already configured)

---

## 📞 SUPPORT

All API calls are extensively logged. Check browser console for:
- Request payloads
- Response data
- Error messages
- Endpoint URLs

The frontend is designed to gracefully handle API failures with mock responses and fallback data.
