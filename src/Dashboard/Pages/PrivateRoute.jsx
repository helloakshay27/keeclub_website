import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
  // Check for both authToken (from OTP login) and salesforce_access_token
  const authToken = localStorage.getItem('authToken');
  const salesforceToken = localStorage.getItem('salesforce_access_token');
  const loyaltyId = localStorage.getItem('Loyalty_Member_Unique_Id__c');
  
  // User is authenticated if they have authToken AND salesforce token AND loyalty ID
  const isAuthenticated = Boolean(authToken && salesforceToken && loyaltyId);
  const location = useLocation();

  // Debug logging
  console.log('PrivateRoute - Auth Check:', {
    authToken: !!authToken,
    salesforceToken: !!salesforceToken,
    loyaltyId: !!loyaltyId,
    isAuthenticated
  });

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
