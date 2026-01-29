import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const EncashConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { encashRequest } = location.state || {};

    // Helper to get loyaltyId from localStorage
    const getLoyaltyId = () => {
        const loyaltyIdRaw = localStorage.getItem("Loyalty_Member_Unique_Id__c");
        return loyaltyIdRaw ? loyaltyIdRaw.replace(/^0+/, '') : '';
    };

    if (!encashRequest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-800 mb-4">Encash request not found</h1>
                    <button
                        onClick={() => {
                            const loyaltyId = getLoyaltyId();
                            if (loyaltyId) {
                                navigate(`/dashboard/transactions/${loyaltyId}`);
                            } else {
                                navigate('/dashboard/transactions');
                            }
                        }}
                        className="px-6 py-3 bg-[#f9461c] text-white rounded-lg hover:bg-[#e63e0f]"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#f9461c] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                ✓
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">Encash</span>
                        </div>
                        <div className="w-16 h-1 bg-[#f9461c]"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#f9461c] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                ✓
                            </div>
                            <span className="ml-2 text-sm font-medium text-[#f9461c]">Confirmation</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#24293c] text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-6">
                        <CheckCircle size={80} className="text-[#f9461c] mx-auto" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Thank You!
                    </h1>
                    <p className="text-xl">
                        Your Encash Request #{encashRequest.id} has been submitted successfully
                    </p>
                    <div className="mt-4 p-4 bg-green-600 rounded-lg">
                        <p className="text-lg font-semibold">
                            {encashRequest.points_to_encash?.toLocaleString()} Points Requested
                        </p>
                        <p className="text-sm">
                            Amount Payable: ₹{encashRequest.amount_payable?.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Encash Request Details
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Request ID:</strong> {encashRequest.id}</p>
                        <p><strong>Points to Encash:</strong> {encashRequest.points_to_encash?.toLocaleString()}</p>
                        {/* <p><strong>Facilitation Fee:</strong> ₹{encashRequest.facilitation_fee?.toLocaleString()}</p> */}
                        <p><strong>Amount Payable:</strong> ₹{encashRequest.amount_payable?.toLocaleString()}</p>
                        <p><strong>Account Number:</strong> {encashRequest.account_number}</p>
                        <p><strong>Branch Name:</strong> {encashRequest.branch_name}</p>
                        <p><strong>IFSC Code:</strong> {encashRequest.ifsc_code}</p>
                        <p><strong>Person Name:</strong> {encashRequest.person_name}</p>
                        <p ><strong>Status:</strong>
                            <span style={{ textTransform: 'capitalize' }}>
                                {encashRequest.status}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            const loyaltyId = getLoyaltyId();
                            if (loyaltyId) {
                                navigate(`/dashboard/transactions/${loyaltyId}`);
                            } else {
                                navigate('/dashboard/transactions');
                            }
                        }}
                        className="inline-flex items-center px-8 py-3 border-2 border-[#f9461c] text-[#f9461c] font-semibold rounded-lg hover:bg-[#f9461c] hover:text-white transition-colors duration-300"
                    >
                        <Home className="mr-2" size={20} />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EncashConfirmation;
