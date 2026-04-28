import React, { useState, useEffect, useRef } from 'react';
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
    const [isEmailLocked, setIsEmailLocked] = useState(true);
    const emailInputRef = useRef(null);
    const aadharInputRef = useRef(null);
    const panInputRef = useRef(null);
    const chequeInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [encashRequests, setEncashRequests] = useState([]);
    const [encashLoading, setEncashLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [documents, setDocuments] = useState({
        aadhar: null,
        pan: null,
        cheque: null
    });

    // track pending encash amount from backend
    const [pendingEncashAmount, setPendingEncashAmount] = useState(0); // Change to 0 instead of null
    const PENDING_URL_BASE = BASE_URL;

    const BalancePoints = localStorage.getItem('Loyalty_Balance__c') || 0;

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle document upload
    const handleDocumentUpload = async (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid file (PDF, JPG, or PNG)');
            e.target.value = '';
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            e.target.value = '';
            return;
        }

        try {
            const base64String = await fileToBase64(file);
            setDocuments(prev => ({
                ...prev,
                [docType]: {
                    filename: file.name,
                    content_type: file.type,
                    content: base64String
                }
            }));
            toast.success(`${docType.toUpperCase()} document uploaded successfully`);
        } catch (error) {
            toast.error('Failed to process document');
            console.error('File conversion error:', error);
        }
    };

    // Remove uploaded document
    const removeDocument = (docType) => {
        setDocuments(prev => ({ ...prev, [docType]: null }));
        const refMap = { aadhar: aadharInputRef, pan: panInputRef, cheque: chequeInputRef };
        if (refMap[docType]?.current) refMap[docType].current.value = '';
    };

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
                                const instanceUrl = localStorage.getItem('salesforce_instance_url');
                                
                                // Use SAP code only if referral names match exactly
                                let encashedUniqueCode = "";
                                if (req.referral_name && req.sap_sales_order_code) {
                                    // Find matching opportunity by AccountNameText__c
                                    const matchingOpp = opportunityOptions.find(o => o.AccountNameText__c === req.referral_name);
                                    if (matchingOpp) {
                                        // Only use the SAP code from request if names match exactly
                                        encashedUniqueCode = req.sap_sales_order_code;
                                    } else {
                                        console.log("❌ No matching referral found for:", req.referral_name);
                                    }
                                } else if (req.referral_name) {
                                    // Fallback: get SAP code from filtered opportunities if exact match found
                                    const opp = opportunityOptions.find(o => o.AccountNameText__c === req.referral_name);
                                    if (opp && opp.SAP_SalesOrder_Code__c) {
                                        encashedUniqueCode = opp.SAP_SalesOrder_Code__c;
                                    }
                                }
                                
                                // PATCH existing SFDC record or fallback to POST
                                const sfTxId = req.sfdc_transaction_record_id;
                                if (sfTxId) {
                                    await fetch(`${instanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/${sfTxId}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                                        body: JSON.stringify({ Transaction_Status__c: "Completed" })
                                    });
                                } else if (encashedUniqueCode && encashedUniqueCode.trim() !== "") {
                                    await fetch(`${instanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                                        body: JSON.stringify({
                                            Category__c: "Encash",
                                            Loyalty_Member__c: loyaltyMemberId,
                                            Loyalty_Points__c: req.points_to_encash,
                                            Transaction_Type__c: "Debit",
                                            Encashed_Unique_Code__c: encashedUniqueCode,
                                            Transaction_Status__c: "Completed"
                                        })
                                    });
                                } else {
                                    console.log("❌ Skipping Salesforce transaction - no SFDC record ID or SAP code");
                                }
                            } catch (err) {
                                // Optionally handle/log error
                            }
                        }
                        // Handle rejected encash requests
                        if (req.status === "rejected" && req.sfdc_transaction_record_id && !localStorage.getItem(`sfdc_rejected_synced_${req.id}`)) {
                            const rejInstanceUrl = localStorage.getItem('salesforce_instance_url');
                            const rejAccessToken = localStorage.getItem('salesforce_access_token');
                            if (rejAccessToken && rejInstanceUrl) {
                                try {
                                    await fetch(`${rejInstanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/${req.sfdc_transaction_record_id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${rejAccessToken}` },
                                        body: JSON.stringify({ Transaction_Status__c: "Rejected" })
                                    });
                                    localStorage.setItem(`sfdc_rejected_synced_${req.id}`, 'true');
                                } catch (err) {
                                    console.error('Failed to update rejected status in SFDC:', err);
                                }
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

    // Add function to fetch pending encash amount on component mount
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
        fetchPendingEncashAmount(); // Fetch pending encash amount on mount
    }, [navigate]);

    // Prefill email from localStorage (saved during login) and lock it by default
    useEffect(() => {
        const emailFromStorage = localStorage.getItem('user_email');
        if (emailFromStorage) {
            setFormData(prev => ({ ...prev, email: emailFromStorage }));
            setIsEmailLocked(true);
        } else {
            setIsEmailLocked(false);
        }
    }, []);

    // Use currentPoints from memberData prop or localStorage
    const currentPoints = Number(localStorage.getItem('Loyalty_Balance__c')) || 0;

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

            // Auto-calculate facilitation fees and amount payable (commented as per request)
            // if (field === 'pointsToEncash' && processedValue) {
            //     const points = parseInt(processedValue) || 0;
            //     const fees = Math.round(points * 0.02); // 2% facilitation fee
            //     const amount = points - fees;
            //
            //     updated.facilitationFees = fees.toString();
            //     updated.amountPayable = amount.toString();
            // }

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
            isAccountNumberMatched &&
            documents.aadhar &&
            documents.pan &&
            documents.cheque
        );
    };

    const [opportunityOptions, setOpportunityOptions] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [selectedSAPCode, setSelectedSAPCode] = useState(''); // Add state for SAP code

    // Fetch opportunity dropdown data
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                const accessToken = localStorage.getItem("salesforce_access_token");
                const instanceUrl = localStorage.getItem("salesforce_instance_url");
                
                // Updated query to include isEncashed__c filter as per Postman request
                const url = `${instanceUrl}/services/data/v64.0/query/?q=SELECT+Id,AccountNameText__c,Agreement_Value__c,Project_Finalized__r.Onboarding_Referral_Percentage__c,Apartment_Finalized__r.Name,Project_Finalized__r.Name,Tower_Finalized__r.Name,SAP_SalesOrder_Code__c,isEncashed__c+FROM+Opportunity+WHERE+StageName+=+'WC+/+Onboarding+done'+AND+Loyalty_Member_Unique_Id__c='${loyaltyId}'+AND+Encashment_Status__c =null+AND+Registration_Done__c+=true`;
                // const url = `${instanceUrl}/services/data/v64.0/query/?q=SELECT+Id,AccountNameText__c,Agreement_Value__c,Project_Finalized__r.Onboarding_Referral_Percentage__c,Apartment_Finalized__r.Name,Project_Finalized__r.Name,Tower_Finalized__r.Name,SAP_SalesOrder_Code__c,isEncashed__c+FROM+Opportunity+WHERE+StageName+=+'WC+/+Onboarding+done'+AND+Loyalty_Member_Unique_Id__c='${loyaltyId}'+AND+isEncashed__c+=false`;
                
                
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
            const calculatedPoints = parseFloat(((agreementValue * brokerage) / 100).toFixed(2));

            // Set the SAP code for display
            setSelectedSAPCode(selectedOpportunity.SAP_SalesOrder_Code__c || '');

            setFormData(prev => ({
                ...prev,
                pointsToEncash: calculatedPoints ? calculatedPoints.toString() : ''
                // facilitationFees and amountPayable must be entered manually
            }));
        } else {
            setSelectedSAPCode(''); // Reset SAP code when no opportunity selected
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

            // Get SAP Sales Order Code for logging
            const sapCode = selectedOpportunity?.SAP_SalesOrder_Code__c || "";

            // Build attachments array
            const attachments = [];
            if (documents.aadhar) {
                attachments.push({
                    relation: "KYC_Aadhar",
                    filename: documents.aadhar.filename,
                    content_type: documents.aadhar.content_type,
                    content: documents.aadhar.content
                });
            }
            if (documents.pan) {
                attachments.push({
                    relation: "KYC_PAN",
                    filename: documents.pan.filename,
                    content_type: documents.pan.content_type,
                    content: documents.pan.content
                });
            }
            if (documents.cheque) {
                attachments.push({
                    relation: "KYC_Cheque",
                    filename: documents.cheque.filename,
                    content_type: documents.cheque.content_type,
                    content: documents.cheque.content
                });
            }

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
                    sap_sales_order_code: sapCode, // Ensure SAP code is included
                    email: formData.email,
                    attachments: attachments
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
                const lockedEmail = formData.email;
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
                    email: lockedEmail // Preserve fetched email after submission
                });
                setDocuments({
                    aadhar: null,
                    pan: null,
                    cheque: null
                });
                setSelectedOpportunity(null);
                if (typeof setSelectedRedemptionTab === 'function') {
                    setSelectedRedemptionTab('My Encash Requests');
                }
                await fetchPendingEncashAmount();
                // Push to SFDC with Pending status on encash creation
                const sfAccessToken = localStorage.getItem('salesforce_access_token');
                const sfInstanceUrl = localStorage.getItem('salesforce_instance_url');
                const sfLoyaltyMemberId = localStorage.getItem('Id');
                const sfSapCode = selectedOpportunity?.SAP_SalesOrder_Code__c || "";
                const localRequestId = response?.id || response?.encash_request?.id;
                if (sfAccessToken && sfInstanceUrl && sfLoyaltyMemberId && sfSapCode && localRequestId) {
                    try {
                        const sfRes = await fetch(`${sfInstanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sfAccessToken}` },
                            body: JSON.stringify({
                                Loyalty_Member__c: sfLoyaltyMemberId,
                                Transaction_Type__c: "Debit",
                                Loyalty_Points__c: Number(formData.pointsToEncash),
                                Category__c: "Encash",
                                Encashed_Unique_Code__c: sfSapCode,
                                Transaction_Status__c: "Pending"
                            })
                        });
                        const sfData = await sfRes.json();
                        if (sfData.id) {
                            // Save SFDC transaction record ID back to Rails backend
                            const authToken = localStorage.getItem('authToken');
                            await fetch(`${BASE_URL}encash_requests/${localRequestId}.json`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                                body: JSON.stringify({ encash_request: { sfdc_transaction_record_id: sfData.id } })
                            });
                        }
                    } catch (sfErr) {
                        console.error('Failed to push encash to SFDC:', sfErr);
                    }
                }
                // Navigate to Encash Confirmation page with encash request details
                navigate('/encash-confirmation', { state: { encashRequest: response } });
            } else {
                toast.error(response.message || 'Failed to submit encash request. Please try again.');
            }
        } catch (error) {
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
                                {(currentPoints - pendingEncashAmount).toLocaleString('en-IN')} Balance Point
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
                            {/* Display SAP Sales Order Code when opportunity is selected */}
                            {/* {selectedSAPCode && (
                                <p className="mt-2 text-sm text-blue-600 font-medium">
                                    <span className="font-semibold">SAP Sales Order Code:</span> {selectedSAPCode}
                                </p>
                            )} */}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Value <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                        value={selectedOpportunity.Agreement_Value__c ? Math.round(Number(selectedOpportunity.Agreement_Value__c)).toLocaleString('en-IN') : "N/A"}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage Percentage <span className="text-red-500">*</span></label>
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
                                    Points Accumulated to Encash
                                </label>
                                <input
                                    type="text"
                                    placeholder="Points"
                                    value={formData.pointsToEncash ? Number(formData.pointsToEncash).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : "0"}
                                    disabled
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                                />
                            </div>
                            {/* Fourth Row: Email (full width) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                                <input
                                    ref={emailInputRef}
                                    type="email"
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${isEmailLocked && formData.email ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    disabled={isEmailLocked && !!formData.email}
                                    required
                                />
                                {formData.email && (
                                    <button
                                        type="button"
                                        className="mt-2 text-sm font-medium cursor-pointer text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                        onClick={() => {
                                            setIsEmailLocked(prev => {
                                                const newVal = !prev;
                                                if (!newVal) {
                                                    // Unlocking: focus the input after React re-renders
                                                    setTimeout(() => emailInputRef.current?.focus(), 0);
                                                }
                                                return newVal;
                                            });
                                        }}
                                    >
                                        {isEmailLocked ? (
                                            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg> Edit email</>
                                        ) : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> Lock email</>
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Fifth Row: Aadhar, PAN and Cheque Document Upload */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhar Document <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        ref={aadharInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleDocumentUpload(e, 'aadhar')}
                                    />
                                    {documents.aadhar ? (
                                        <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-lg px-4 py-2">
                                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-green-700 truncate flex-1">{documents.aadhar.filename}</span>
                                            <button type="button" onClick={() => removeDocument('aadhar')} className="text-red-500 hover:text-red-700 cursor-pointer text-xs font-medium">Remove</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => aadharInputRef.current?.click()} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-500 hover:border-orange-400 cursor-pointer">Choose file</button>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PAN Document <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        ref={panInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleDocumentUpload(e, 'pan')}
                                    />
                                    {documents.pan ? (
                                        <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-lg px-4 py-2">
                                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-green-700 truncate flex-1">{documents.pan.filename}</span>
                                            <button type="button" onClick={() => removeDocument('pan')} className="text-red-500 hover:text-red-700 cursor-pointer text-xs font-medium">Remove</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => panInputRef.current?.click()} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-500 hover:border-orange-400 cursor-pointer">Choose file</button>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cancelled Cheque <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        ref={chequeInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleDocumentUpload(e, 'cheque')}
                                    />
                                    {documents.cheque ? (
                                        <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-lg px-4 py-2">
                                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-green-700 truncate flex-1">{documents.cheque.filename}</span>
                                            <button type="button" onClick={() => removeDocument('cheque')} className="text-red-500 hover:text-red-700 cursor-pointer text-xs font-medium">Remove</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => chequeInputRef.current?.click()} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-500 hover:border-orange-400 cursor-pointer">Choose file</button>
                                    )}
                                </div>
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
                            Points to Encash: <strong>{Number(formData.pointsToEncash).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>
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
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => navigate(`/encash-details/${req.id}`)}
                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
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
