import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionAPI from '../services/promotionAPI';
import { toast } from 'react-toastify';
import BASE_URL from '../Confi/baseurl';

const Encash = ({ memberData, setSelectedRedemptionTab }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pointsToEncash: '',
        facilitationFees: '',
        amountPayable: '',
        accountNumber: '',
        confirmAccountNumber: '', // Added confirm account number
        ifscCode: '',
        branchName: '',
        personName: '',
        agreeToTerms: false,
        email: '' // Add email field
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [encashRequests, setEncashRequests] = useState([]);
    const [encashLoading, setEncashLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // track pending encash amount from backend
    const [pendingEncashAmount, setPendingEncashAmount] = useState(null);
    const PENDING_URL_BASE = BASE_URL;

    const BalancePoints = localStorage.getItem('Loyalty_Balance__c') || 0;
    // Fetch encash requests on mount
    useEffect(() => {
        const fetchEncashRequests = async () => {
            setEncashLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    setEncashRequests([]);
                    setEncashLoading(false);
                    return;
                }
                const res = await fetch(`${BASE_URL}encash_requests.json`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEncashRequests(Array.isArray(data) ? data : []);
                    // For each completed & not deducted, trigger payment deduction and Salesforce debit
                    for (const req of Array.isArray(data) ? data : []) {
                        if (req.status === "completed" && req.is_payment_deducted === false) {
                            try {
                                // 1. Call local PUT API to update payment deducted
                                await fetch(`${BASE_URL}update_payment_deducted.json?id=${req.id}&is_payment_deducted=true`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${authToken}`,
                                        'Accept': '*/*',
                                        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
                                        'Origin': window.location.origin,
                                    }
                                });
                                // 2. Call Salesforce Debit API for encash
                                const loyaltyMemberId = localStorage.getItem('Id');
                                const accessToken = localStorage.getItem('salesforce_access_token');
                                if (loyaltyMemberId && accessToken) {
                                    await fetch('https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/sobjects/Loyalty_Transaction__c/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`
                                        },
                                        body: JSON.stringify({
                                            Category__c: "Encash",
                                            Loyalty_Member__c: loyaltyMemberId,
                                            Loyalty_Points__c: req.points_to_encash,
                                            Transaction_Type__c: "Debit"
                                        })
                                    });
                                }
                            } catch (err) {
                                // Optionally handle/log error
                            }
                        }
                    }
                } else {
                    setEncashRequests([]);
                }
            } catch (error) {
                setEncashRequests([]);
            } finally {
                setEncashLoading(false);
            }
        };
        fetchEncashRequests();
        // optional: initial pending amount fetch
        // fetchPendingEncashAmount(); // (uncomment if you want to fetch on mount)
    }, []);

    const fetchPendingEncashAmount = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const res = await fetch(`${BASE_URL}pending_encash_amount`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!res.ok) return;
            const data = await res.json();
            if (data && typeof data.total_pending_encash_amount !== 'undefined') {
                setPendingEncashAmount(Number(data.total_pending_encash_amount));
                toast.info(`Pending encash amount: ${Number(data.total_pending_encash_amount).toLocaleString('en-IN')}`);
            }
        } catch (err) {
            // fail silently
            console.error('Failed to fetch pending encash amount', err);
        }
    };

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuthentication = () => {
            const authToken = localStorage.getItem('authToken');
            const isLoggedIn = authToken && authToken !== 'null';

            if (!isLoggedIn) {
                toast.error('Please login to access the Encash feature');
                navigate('/login'); // Redirect to login page
                return;
            }

            setIsCheckingAuth(false);
        };

        checkAuthentication();
    }, [navigate]);

    // Use currentPoints from memberData prop or localStorage
    const currentPoints = memberData?.current_loyalty_points || Number(localStorage.getItem('Loyalty_Balance__c')) || 0;

    const handleInputChange = (field, value) => {
        let processedValue = value;
        let newErrors = { ...validationErrors };

        // Validation for Person Name
        if (field === 'personName') {
            // Only allow alphabets and spaces, max 50 chars
            processedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            if (processedValue !== value && value.length > 0) {
                newErrors.personName = "Invalid name. Enter valid name as per bank account.";
            } else {
                delete newErrors.personName;
            }
        }

        // Validation for Branch Name
        if (field === 'branchName') {
            // Only allow alphabets and spaces, max 50 chars
            processedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            if (processedValue !== value && value.length > 0) {
                newErrors.branchName = "Enter valid branch name.";
            } else {
                delete newErrors.branchName;
            }
        }

        // Validation for Account Number (numeric only)
        if (field === 'accountNumber' || field === 'confirmAccountNumber') {
            processedValue = value.replace(/[^0-9]/g, '');
        }

        // Validation for IFSC Code (alphanumeric only)
        if (field === 'ifscCode') {
            processedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        }

        setValidationErrors(newErrors);

        setFormData(prev => {
            const updated = { ...prev, [field]: processedValue };

            // Auto-calculate facilitation fees and amount payable
            if (field === 'pointsToEncash' && processedValue) {
                const points = parseInt(processedValue) || 0;
                const fees = Math.round(points * 0.02); // 2% facilitation fee
                const amount = points - fees;

                updated.facilitationFees = fees.toString();
                updated.amountPayable = amount.toString();
            }

            return updated;
        });
    };

    // Check if all mandatory fields are valid
    const isFormValid = () => {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pointsToEncash = Number(formData.pointsToEncash) || 0;
        const balancePoints = Number(localStorage.getItem('Loyalty_Balance__c')) || 0;

        // Disable if points to encash > balance
        if (pointsToEncash > balancePoints) return false;

        return (
            selectedOpportunity &&
            formData.pointsToEncash &&
            formData.personName &&
            formData.accountNumber &&
            formData.confirmAccountNumber &&
            formData.ifscCode &&
            formData.branchName &&
            formData.email &&
            emailRegex.test(formData.email) &&
            formData.agreeToTerms &&
            Object.keys(validationErrors).length === 0 &&
            isAccountNumberMatched
        );
    };

    const [opportunityOptions, setOpportunityOptions] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    // Fetch opportunity dropdown data
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                const accessToken = localStorage.getItem("salesforce_access_token");
                const url = `https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/query/?q=SELECT+Id,AccountNameText__c,Agreement_Value__c,Project_Finalized__r.Onboarding_Referral_Percentage__c,Apartment_Finalized__r.Name,Project_Finalized__r.Name,Tower_Finalized__r.Name,SAP_SalesOrder_Code__c+FROM+Opportunity+WHERE+StageName+=+'WC+/+Onboarding+done'+AND+Loyalty_Member_Unique_Id__c='${loyaltyId}'`;
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setOpportunityOptions(data?.records || []);
            } catch (err) {
                setOpportunityOptions([]);
            }
        };
        fetchOpportunities();
    }, []);

    // Calculate points to encash based on agreement value and brokerage percentage
    useEffect(() => {
        if (selectedOpportunity) {
            const agreementValue = Number(selectedOpportunity.Agreement_Value__c) || 0;
            const brokerage = Number(selectedOpportunity.Project_Finalized__r?.Onboarding_Referral_Percentage__c) || 0;
            const calculatedPoints = Math.round((agreementValue * brokerage) / 100);
            setFormData(prev => ({
                ...prev,
                pointsToEncash: calculatedPoints ? calculatedPoints.toString() : '',
                facilitationFees: calculatedPoints ? Math.round(calculatedPoints * 0.02).toString() : '',
                amountPayable: calculatedPoints
                    ? (calculatedPoints - Math.round(calculatedPoints * 0.02)).toString()
                    : ''
            }));
        }
    }, [selectedOpportunity]);

    // Account number match validation
    const isAccountNumberMatched = formData.accountNumber === formData.confirmAccountNumber;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check authentication before submission
        const authToken = localStorage.getItem('authToken');
        if (!authToken || authToken === 'null') {
            toast.error('Your session has expired. Please login again.');
            navigate('/login');
            return;
        }

        // Validation
        if (!isAccountNumberMatched) {
            toast.error('Account number and confirm account number do not match.');
            return;
        }
        if (!formData.agreeToTerms) {
            toast.error('Please agree to the Terms and Conditions');
            return;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        // Ensure sufficient points to encash
        const pointsToEncash = Number(formData.pointsToEncash) || 0;
        if (pointsToEncash > currentPoints) {
            toast.error('You do not have sufficient points to encash.');
            return;
        }

        try {
            setLoading(true);

            // Build request body as per API spec, include selected opportunity fields
            const encashRequestBody = {
                encash_request: {
                    points_to_encash: Number(formData.pointsToEncash),
                    facilitation_fee: Number(formData.facilitationFees),
                    amount_payable: Number(formData.amountPayable),
                    account_number: formData.accountNumber,
                    ifsc_code: formData.ifscCode,
                    branch_name: formData.branchName,
                    person_name: formData.personName,
                    terms_accepted: !!formData.agreeToTerms,
                    brokerage_percentages: selectedOpportunity?.Project_Finalized__r?.Onboarding_Referral_Percentage__c || "",
                    referral_name: selectedOpportunity?.AccountNameText__c || "",
                    booking_unit: selectedOpportunity?.Apartment_Finalized__r?.Name || "",
                    application_value: selectedOpportunity?.Agreement_Value__c || "",
                    email: formData.email // Pass email in payload
                }
            };

            const authToken = localStorage.getItem('authToken');
            const res = await fetch(`${BASE_URL}encash_requests.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': '*/*',
                    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
                    'Origin': window.location.origin,
                },
                body: JSON.stringify(encashRequestBody)
            });
            const response = await res.json();

            if (res.ok || res.status === 201) {
                setSuccess(true);
                toast.success('Encash request submitted successfully! You will receive confirmation shortly.');
                setFormData({
                    pointsToEncash: '',
                    facilitationFees: '',
                    amountPayable: '',
                    accountNumber: '',
                    confirmAccountNumber: '',
                    ifscCode: '',
                    branchName: '',
                    personName: '',
                    agreeToTerms: false,
                    email: '' // Reset email field
                });
                if (typeof setSelectedRedemptionTab === 'function') {
                    setSelectedRedemptionTab('My Encash Requests');
                }
                await fetchPendingEncashAmount();
                // Navigate to Encash Confirmation page with encash request details
                navigate('/encash-confirmation', { state: { encashRequest: response } });
            } else {
                toast.error(response.message || 'Failed to submit encash request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting encash request:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // More detailed error message
            let errorMessage = 'An error occurred while submitting your request.';
            if (error.message) {
                errorMessage += ` Error: ${error.message}`;
            }
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage += ' Please check your internet connection.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Test function to debug API connection
    const testAPIConnection = async () => {
        console.log('Testing API connection...');
        console.log('Base URL:', 'https://piramal-loyalty-dev.lockated.com/');
        console.log('Auth Token:', localStorage.getItem('authToken'));
        console.log('Member Data:', memberData);

        try {
            const testPayload = {
                encash_request: {
                    points_to_encash: 1000,
                    facilitation_fee: 20,
                    amount_payable: 980,
                    account_number: "test123",
                    ifsc_code: "TEST0000123",
                    branch_name: "Test Branch",
                    person_name: "Test User",
                    terms_accepted: true
                }
            };

            console.log('Test payload:', testPayload);

            const response = await fetch('https://piramal-loyalty-dev.lockated.com/encash_requests.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(testPayload)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                toast.success(`Test API call successful! Status: ${response.status}. Check console for details.`);
            } else {
                toast.error(`Test API call failed! Status: ${response.status}. Check console for details.`);
            }
        } catch (error) {
            console.error('Test API error:', error);
            toast.error(`Test API failed: ${error.message}`);
        }
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Checking authentication...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Points Balance Header */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8 flex items-center justify-between relative">
                <h2 className="text-2xl font-bold text-gray-800">Encash Form</h2>
                <div className="flex items-center space-x-4">
                    {currentPoints > 0 && (
                        <div className="flex items-center space-x-2">
                            <img
                                src="/redeemStar.png"
                                alt="star"
                                className="mr-1"
                                style={{ width: 24, height: 24, display: 'inline-block' }}
                            />
                            <span className="text-xl font-bold text-gray-800">
                                {currentPoints.toLocaleString('en-IN')} Point
                            </span>
                        </div>
                    )}
                </div>

                {/* Balance Points with Info Icon */}
                {/* <div className="absolute top-1 right-1 z-10 group" style={{ minWidth: 40 }}>
                    <div className="flex items-center relative">
                        <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fa46151a] text-[#fa4615] cursor-pointer relative transition-all duration-4000"
                            style={{
                                boxShadow: "0 2px 8px 0 rgba(250,70,22,0.08)",
                                zIndex: 2,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="#fa4615"
                                    strokeWidth="2"
                                    fill="#fff"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16v-4m0-4h.01"
                                    stroke="#fa4615"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                        <span
                            className="absolute right-9 top-1/2 -translate-y-1/2 bg-white border border-[#fa4615] text-[#fa4615] px-3 py-1 rounded shadow text-xs font-semibold whitespace-nowrap opacity-100"
                            style={{
                                boxShadow: "0 2px 8px 0 rgba(250,70,22,0.08)",
                            }}
                        >
                            Balance: {Number(localStorage.getItem('Loyalty_Balance__c') || 0).toLocaleString('en-IN')} Points
                        </span>
                    </div>
                </div> */}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
                {/* Opportunity Dropdown */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Name of the Referred Person <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                value={selectedOpportunity?.Id || ""}
                                onChange={e => {
                                    const found = opportunityOptions.find(opt => opt.Id === e.target.value);
                                    setSelectedOpportunity(found || null);
                                }}
                                required
                            >
                                <option value="">Select Name</option>
                                {opportunityOptions.map(opt => (
                                    <option key={opt.Id} value={opt.Id}>
                                        {opt.AccountNameText__c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Unit</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                value={
                                    (() => {
                                        const parts = [
                                            selectedOpportunity?.Project_Finalized__r?.Name,
                                            selectedOpportunity?.Tower_Finalized__r?.Name,
                                            selectedOpportunity?.Apartment_Finalized__r?.Name
                                        ].filter(Boolean);
                                        return parts.length > 0 ? parts.join(' - ') : "N/A";
                                    })()
                                }
                                disabled
                            />
                        </div>
                    </div>
                    {selectedOpportunity && (
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            {/* Second Row: Agreement Value and Brokerage Percentage */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Value</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                        value={selectedOpportunity.Agreement_Value__c ? selectedOpportunity.Agreement_Value__c.toLocaleString('en-IN') : "N/A"}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage Percentage</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                        value={selectedOpportunity.Project_Finalized__r?.Onboarding_Referral_Percentage__c || "N/A"}
                                        disabled
                                    />
                                </div>
                            </div>
                            {/* Third Row: Points to Encash (full width) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Points want to encash
                                </label>
                                <input
                                    type="number"
                                    placeholder="Points"
                                    value={formData.pointsToEncash || "0"}
                                    disabled
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                />
                            </div>
                            {/* Fourth Row: Email (full width) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* Bank Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Bank Details</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Person Name (as per Bank Account) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter person name"
                                    value={formData.personName}
                                    onChange={(e) => handleInputChange('personName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                    maxLength="50"
                                />
                                {validationErrors.personName && (
                                    <p className="text-sm text-red-500 mt-1">{validationErrors.personName}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter bank account no."
                                        value={formData.accountNumber}
                                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Account No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Confirm bank account no."
                                        value={formData.confirmAccountNumber}
                                        onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {!isAccountNumberMatched && formData.confirmAccountNumber && (
                                        <p className="text-sm text-red-500 mt-1">Account numbers do not match.</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IFSC Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter IFSC code (alphanumeric)"
                                    value={formData.ifscCode}
                                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                    pattern="[A-Z0-9]{11}"
                                    maxLength="11"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter branch name"
                                    value={formData.branchName}
                                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                    maxLength="50"
                                />
                                {validationErrors.branchName && (
                                    <p className="text-sm text-red-500 mt-1">{validationErrors.branchName}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Terms and Conditions - moved to last before submit */}
                <div className="flex items-start space-x-3 my-8">
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                        required
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <span className="text-orange-600 hover:text-orange-700 cursor-pointer underline">
                            Terms and Conditions
                        </span> <span className="text-red-500">*</span>
                    </label>
                </div>
                {/* Submit Button */}
                {Number(formData.pointsToEncash) > Number(localStorage.getItem('Loyalty_Balance__c') || 0) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded text-red-700 font-semibold">
                        Insufficient points!<br />
                        <span>
                            Points to Encash: <strong>{Number(formData.pointsToEncash).toLocaleString('en-IN')}</strong>
                        </span>
                        <br />
                        <span>
                            Balance Points: <strong>{Number(localStorage.getItem('Loyalty_Balance__c') || 0).toLocaleString('en-IN')}</strong>
                        </span>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${loading || !isFormValid()
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {/* Encash Requests List */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Encash Requests</h3>
                {encashLoading ? (
                    <div className="text-gray-500">Loading encash requests...</div>
                ) : encashRequests.length === 0 ? (
                    <div className="text-gray-500">No encash requests found.</div>
                ) : (
                    <div className="space-y-4">
                        {[...encashRequests].reverse().map((req, idx) => (
                            <div key={req.id || idx} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                Request #{req.id}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${req.status === 'completed' ? 'bg-green-100 text-green-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{req.status || '--'}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-2">
                                            <div className="flex"><span className="font-medium w-32 inline-block">Date</span><span className="">{req.created_at ? new Date(req.created_at).toLocaleString('en-IN') : '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Points</span><span className="">{req.points_to_encash?.toLocaleString('en-IN') || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Amount</span><span className="">₹{req.amount_payable?.toLocaleString('en-IN') || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Branch</span><span className="">{req.branch_name || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">IFSC</span><span className="">{req.ifsc_code || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">User Name</span><span className="">{req.person_name || '--'}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Encash;
