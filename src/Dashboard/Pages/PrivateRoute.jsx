import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Helper function to check if a value is valid (not null, not "null" string, not undefined, not empty)
const isValidAuthValue = (value) => {
  return value && value !== "null" && value !== "undefined" && value.trim() !== "";
};

export default function PrivateRoute() {
  // Check for both authToken (from OTP login) and salesforce_access_token
  const authToken = localStorage.getItem('authToken');
  const salesforceToken = localStorage.getItem('salesforce_access_token');
  const loyaltyId = localStorage.getItem('Loyalty_Member_Unique_Id__c');
  
  // User is authenticated if they have authToken AND salesforce token AND loyalty ID
  // Also validate that none of these are the string "null" or empty
  const isAuthenticated = isValidAuthValue(authToken) && 
                          isValidAuthValue(salesforceToken) && 
                          isValidAuthValue(loyaltyId);
  const location = useLocation();

  // Debug logging
  console.log('PrivateRoute - Auth Check:', {
    authToken: !!authToken,
    authTokenValid: isValidAuthValue(authToken),
    salesforceToken: !!salesforceToken,
    salesforceTokenValid: isValidAuthValue(salesforceToken),
    loyaltyId: !!loyaltyId,
    loyaltyIdValid: isValidAuthValue(loyaltyId),
    isAuthenticated
  });

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
