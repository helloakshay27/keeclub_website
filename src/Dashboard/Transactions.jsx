import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import BASE_URL from '../Confi/baseurl';

const tierBenefits = [
    {
        tier: "Bronze",
        title: "Bronze Tier",
        points: [
            "Every purchase earns you reward points that bring you closer to exclusive experiences.",
            "You’ll be invited to member-only events, receive curated monthly recommendations, and get a warm welcome gift as a new member.",
            "This tier opens the door to thoughtful perks and sets the stage for something truly rewarding.",
            "It’s the foundation for your relationship with Kee Club personal, consistent, and curated with care.",
        ],
    },
    {
        tier: "Silver",
        title: "Silver Tier",
        points: [
            "As a Silver member, you’re celebrated with extra care. You earn points at a faster pace and get access to new arrivals and sales before anyone else.",
            "Your birthday is special here we’ll make sure of it with a curated surprise just for you. Enjoy complimentary standard shipping, priority assistance from our support team, and seasonal offers crafted for your preferences.",
            "With Silver, you step into a space where service is smoother, selections are smarter, and your loyalty is felt.",
        ],
    },
    {
        tier: "Gold",
        title: "Gold Tier",
        points: [
            "Gold membership is an invitation to go deeper with Kee Club.",
            "Enjoy faster rewards, free express shipping, and a dedicated line for quicker support.",
            "You’ll be among the first to access new collections and exclusive drops, with personal invitations to member-only experiences. Receive curated gifts for special milestones, thoughtful service throughout your journey, and styling or shopping recommendations based on your tastes.",
            "Gold is more than a tier it’s a partnership built on trust, taste, and attention.",
        ],
    },
    {
        tier: "Platinum",
        title: "Platinum Tier",
        points: [
            "Platinum is our most exclusive tier, designed for those who truly live the brand.",
            "Your rewards accelerate even further, and your service becomes white-glove. A dedicated concierge is available for personalized styling, private previews, and seamless support.",
            "Enjoy luxury gifting, access to high-touch brand experiences, and invitations to exclusive dinners, launches, or one-on-one sessions. You’ll also receive special recognition, early reservations, and priority access to limited-edition pieces.",
        ],
    },
    {
        tier: "Titanium",
        title: "Titanium Tier",
        points: [
            "Titanium is our most exclusive tier, designed for those who truly live the brand.",
            "Your rewards accelerate even further, and your service becomes white-glove. A dedicated concierge is available for personalized styling, private previews, and seamless support.",
            "Enjoy luxury gifting, access to high-touch brand experiences, and invitations to exclusive dinners, launches, or one-on-one sessions. You’ll also receive special recognition, early reservations, and priority access to limited-edition pieces.",
        ],
    },
];

const formatPoints = (points) => {
    if (typeof points !== "number") return points;
    return points.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newReferral, setNewReferral] = useState({});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pendingEncashAmount, setPendingEncashAmount] = useState(0);
    const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' or 'referrals'
    const [referralRecords, setReferralRecords] = useState([]);
    const [referralLoading, setReferralLoading] = useState(false);
    const [opportunityOptions, setOpportunityOptions] = useState([]); // Add this state

    // Get loyalty member data from localStorage and state
    const [summaryCards, setSummaryCards] = useState([
        { title: "Points", value: 0 },
        { title: "Redeemed Points", value: 0 },
        { title: "Expired Points", value: 0 },
        { title: "Balance Points", value: 0 },
    ]);
    const loyaltyMemberId = localStorage.getItem("Id");
    const mobile = localStorage.getItem("salesforce_mobile");
    const accessToken = localStorage.getItem("salesforce_access_token");

    // Fetch summary card data from Salesforce
    const fetchSummaryCards = async () => {
        try {
            const instanceUrl = localStorage.getItem("salesforce_instance_url");
            const soqlQuery = `SELECT Loyalty_Balance__c, Total_Points_Credited__c, Total_Points_Debited__c, Total_Points_Expired__c FROM Loyalty_Member__c WHERE Phone_Mobile_Number__c IN ('${mobile}', '+91${mobile}') LIMIT 1`;
            const url = `${instanceUrl}/services/data/v64.0/query/?q=${encodeURIComponent(soqlQuery)}`;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const record = res.data?.records?.[0];
            
            if (record) {
                // Update localStorage with fresh data
                localStorage.setItem("Loyalty_Balance__c", record.Loyalty_Balance__c || 0);
                localStorage.setItem("Total_Points_Credited__c", record.Total_Points_Credited__c || 0);
                localStorage.setItem("Total_Points_Debited__c", record.Total_Points_Debited__c || 0);
                localStorage.setItem("Total_Points_Expired__c", record.Total_Points_Expired__c || 0);
            }
            
            setSummaryCards([
                { title: "Points", value: formatPoints(record?.Total_Points_Credited__c || 0) },
                { title: "Redeemed Points", value: formatPoints(record?.Total_Points_Debited__c || 0) },
                { title: "Expired Points", value: formatPoints(record?.Total_Points_Expired__c || 0) },
                { title: "Balance Points", value: formatPoints(record?.Loyalty_Balance__c || 0) },
            ]);
        } catch (err) {
            // fallback to 0s
            setSummaryCards([
                { title: "Points", value: 0 },
                { title: "Redeemed Points", value: 0 },
                { title: "Expired Points", value: 0 },
                { title: "Balance Points", value: 0 },
            ]);
        }
    };

    // Fetch transactions from Salesforce
    // Transaction fetch function, now accessible for referral refresh
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const instanceUrl = localStorage.getItem("salesforce_instance_url");
            const query = `SELECT Id, Name, Loyalty_Points__c, Loyalty_Member__c, Transaction_Type__c, CreatedDate FROM Loyalty_Transaction__c WHERE Loyalty_Member__r.Phone_Mobile_Number__c = '${mobile}' ORDER BY CreatedDate DESC LIMIT 2000`;
            const url = `${instanceUrl}/services/data/v64.0/query/?q=${encodeURIComponent(query)}`;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            let records = res.data?.records || [];
            // If no transactions, create a default credit entry and refetch
            if (records.length === 0 && loyaltyMemberId) {
                await axios.post(
                    `${instanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/`,
                    {
                        Loyalty_Member__c: loyaltyMemberId,
                        Transaction_Type__c: "Credit",
                        Loyalty_Points__c: 10000,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                // Refetch after creation
                const refetch = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                records = refetch.data?.records || [];
            }
            // Map to UI format
            setTransactions(
                records.map((item) => ({
                    created_at: item.CreatedDate,
                    transaction_type: item.Transaction_Type__c,
                    remarks: item.Name,
                    points: item.Loyalty_Points__c,
                }))
            );
        } catch (err) {
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch pending encash amount from backend
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
        }
    };

    // Fetch opportunity options and store in state
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                const accessToken = localStorage.getItem("salesforce_access_token");
                const instanceUrl = localStorage.getItem("salesforce_instance_url");
                
                if (!loyaltyId || !accessToken || !instanceUrl) {
                    console.log("❌ Missing required data for opportunities fetch");
                    return;
                }

                const url = `${instanceUrl}/services/data/v64.0/query/?q=SELECT+Id,AccountNameText__c,Agreement_Value__c,Project_Finalized__r.Onboarding_Referral_Percentage__c,Apartment_Finalized__r.Name,Project_Finalized__r.Name,Tower_Finalized__r.Name,SAP_SalesOrder_Code__c+FROM+Opportunity+WHERE+StageName+=+'WC+/+Onboarding+done'+AND+Loyalty_Member_Unique_Id__c='${loyaltyId}'`;
                console.log("🔄 Fetching opportunities from:", url);
                
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                console.log("✅ Opportunities fetched:", data?.records || []);
                setOpportunityOptions(data?.records || []);
            } catch (err) {
                console.error("❌ Error fetching opportunities:", err);
                setOpportunityOptions([]);
            }
        };
        fetchOpportunities();
    }, []);

    // Fetch encash requests and handle payment deduction and Salesforce debit if needed
    const fetchAndHandleEncashRequests = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            
            console.log("🔄 Starting fetchAndHandleEncashRequests...");
            
            const res = await fetch(`${BASE_URL}encash_requests.json`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!res.ok) return;
            const data = await res.json();
            console.log("🔍 Encash requests data:", data);
            console.log(req.AccountNameText__c,req);
            
            for (const req of Array.isArray(data) ? data : []) {
                if (req.status === "completed" && req.is_payment_deducted === false) {
                    try {
                        // 1. Call local PUT API to update payment deducted
                        const updateResponse = await fetch(`${BASE_URL}update_payment_deducted.json?id=${req.id}&is_payment_deducted=true`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`,
                                'Accept': '*/*',
                                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7',
                                'Origin': window.location.origin,
                            }
                        });
                        
                        const updateData = await updateResponse.json();
                        console.log("📤 Update payment response:", updateData);
                        
                        // 2. Call Salesforce Debit API for encash
                        const loyaltyMemberId = localStorage.getItem('Id');
                        const accessToken = localStorage.getItem('salesforce_access_token');
                        const instanceUrl = localStorage.getItem('salesforce_instance_url');
                        
                        // Get SAP Sales Order Code from multiple sources
                        let encashedUniqueCode = "";
                        
                        console.log("🔍 Looking for SAP code in original request:", req.sap_sales_order_code);
                        console.log("🔍 Looking for SAP code in update response:", updateData?.encash_request?.sap_sales_order_code);
                        console.log("🔍 Looking for referral_name in update response:", updateData?.encash_request?.referral_name);
                        console.log("🔍 Current opportunityOptions state:", opportunityOptions);
                        console.log("🔍 opportunityOptions length:", opportunityOptions.length);
                        
                        // First: Try to get SAP code directly from original encash request
                        if (req.sap_sales_order_code) {
                            encashedUniqueCode = req.sap_sales_order_code;
                            console.log("✅ SAP code found in original request:", encashedUniqueCode);
                        }
                        // Second: Try to get SAP code from update response
                        else if (updateData?.encash_request?.sap_sales_order_code) {
                            encashedUniqueCode = updateData.encash_request.sap_sales_order_code;
                            console.log("✅ SAP code found in update response:", encashedUniqueCode);
                        }
                        // Third: Find by referral name in opportunity options (with current state)
                        else if (updateData?.encash_request?.referral_name && opportunityOptions.length > 0) {
                            const referralName = updateData.encash_request.referral_name;
                            console.log("🔍 Searching for referral name:", referralName);
                            
                            const opp = opportunityOptions.find(o => o.AccountNameText__c === referralName);
                            console.log("🔍 Found opportunity match:", opp);
                            
                            if (opp && opp.SAP_SalesOrder_Code__c) {
                                encashedUniqueCode = opp.SAP_SalesOrder_Code__c;
                                console.log("✅ SAP_SalesOrder_Code__c found from opportunity:", encashedUniqueCode);
                            } else {
                                console.log("❌ No SAP_SalesOrder_Code__c found for opportunity:", opp);
                            }
                        }
                        // Fourth: If no opportunities in state, try to fetch them dynamically
                        else if (updateData?.encash_request?.referral_name && opportunityOptions.length === 0) {
                            console.log("🔄 No opportunities in state, fetching dynamically...");
                            try {
                                const loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                                const url = `${instanceUrl}/services/data/v64.0/query/?q=SELECT+Id,AccountNameText__c,SAP_SalesOrder_Code__c+FROM+Opportunity+WHERE+StageName+=+'WC+/+Onboarding+done'+AND+Loyalty_Member_Unique_Id__c='${loyaltyId}'`;
                                
                                const oppRes = await fetch(url, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                        "Content-Type": "application/json",
                                    },
                                });
                                const oppData = await oppRes.json();
                                console.log("🔍 Dynamically fetched opportunities:", oppData?.records || []);
                                
                                if (oppData?.records?.length > 0) {
                                    const referralName = updateData.encash_request.referral_name;
                                    const opp = oppData.records.find(o => o.AccountNameText__c === referralName);
                                    
                                    if (opp && opp.SAP_SalesOrder_Code__c) {
                                        encashedUniqueCode = opp.SAP_SalesOrder_Code__c;
                                        console.log("✅ SAP code found via dynamic fetch:", encashedUniqueCode);
                                    }
                                }
                            } catch (fetchError) {
                                console.error("❌ Error in dynamic fetch:", fetchError);
                            }
                        }
                        else {
                            console.log("❌ No SAP code found - all methods exhausted");
                            console.log("Request SAP:", req.sap_sales_order_code);
                            console.log("Update response SAP:", updateData?.encash_request?.sap_sales_order_code);
                            console.log("Referral name:", updateData?.encash_request?.referral_name);
                            console.log("Opportunities available:", opportunityOptions.length);
                        }
                        
                        console.log("🔍 Final encashedUniqueCode:", encashedUniqueCode);
                        console.log("🔍 encashedUniqueCode is empty:", encashedUniqueCode === "");
                        
                        if (loyaltyMemberId && accessToken && instanceUrl) {
                            const payload = {
                                Category__c: "Encash",
                                Loyalty_Member__c: loyaltyMemberId,
                                Loyalty_Points__c: req.points_to_encash,
                                Transaction_Type__c: "Debit",
                                Encashed_Unique_Code__c: encashedUniqueCode
                            };
                            console.log("📤 Salesforce Debit API payload:", payload);
                            
                            const salesforceResponse = await fetch(`${instanceUrl}/services/data/v64.0/sobjects/Loyalty_Transaction__c/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`
                                },
                                body: JSON.stringify(payload)
                            });
                            
                            const salesforceResult = await salesforceResponse.json();
                            console.log("📥 Salesforce response:", salesforceResult);
                        }
                        // Refresh summary cards and transactions after update
                        await fetchSummaryCards();
                        await fetchTransactions();
                    } catch (err) {
                        console.error("❌ Error in fetchAndHandleEncashRequests:", err);
                    }
                }
            }
        } catch (err) {
            console.error("❌ Error fetching encash requests:", err);
        }
    };

    // Fetch referral records from Salesforce custom API
    const fetchReferralRecords = async () => {
        setReferralLoading(true);
        try {
            const accessToken = localStorage.getItem("salesforce_access_token");
            const instanceUrl = localStorage.getItem("salesforce_instance_url");
            const loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
            const url = `${instanceUrl}/services/apexrest/getRecordsByLoyaltyId`;
            const body = { loyaltyId };
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.isSuccess && Array.isArray(data.records)) {
                setReferralRecords(data.records);
            } else {
                setReferralRecords([]);
            }
        } catch (err) {
            setReferralRecords([]);
        } finally {
            setReferralLoading(false);
        }
    };

    useEffect(() => {
        if (mobile && accessToken) {
            fetchTransactions();
            fetchSummaryCards();
            fetchPendingEncashAmount();
        }
    }, [mobile, accessToken, loyaltyMemberId]);

    // Always call fetchAndHandleEncashRequests on dashboard mount (page hit)
    useEffect(() => {
        fetchAndHandleEncashRequests();
    }, []);

    // Additional useEffect to fetch data when component mounts for newly logged in users
    useEffect(() => {
        const loginTimestamp = localStorage.getItem("loginTimestamp");
        const currentTime = Date.now();
        const timeDifference = currentTime - parseInt(loginTimestamp || "0");
        
        // If user logged in within the last 5 minutes, ensure data is fetched
        if (loginTimestamp && timeDifference < 5 * 60 * 1000 && mobile && accessToken) {
            setTimeout(() => {
                fetchSummaryCards();
                fetchTransactions();
            }, 1000); // Small delay to ensure all data is ready
        }
    }, []);

    // Referral Modal validation
    const validateReferral = (referral) => {
        const errors = {};
        if (!referral.firstName || referral.firstName.trim().length < 2) {
            errors.firstName = "First name must be at least 2 characters long.";
        }
        if (!referral.lastName || referral.lastName.trim().length < 2) {
            errors.lastName = "Last name must be at least 2 characters long.";
        }
        // Indian phone number regex: starts with 6-9 and has 10 digits
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        if (!referral.phone || !indianPhoneRegex.test(referral.phone)) {
            errors.phone = "Phone number must be a valid 10-digit Indian number starting with 6-9.";
        }
        if (!referral.rating) {
            errors.rating = "Please select a rating.";
        }
        if (!referral.projectInterested) {
            errors.projectInterested = "Please select a project interested.";
        }
        if (!referral.typeOfCustomer) {
            errors.typeOfCustomer = "Please select type of customer.";
        }
        return errors;
    };

    useEffect(() => {
        if (showModal) {
            setNewReferral({});
            setTouched({});
            setErrors({});
            setIsSubmitted(false);
        }
    }, [showModal]);

    useEffect(() => {
        const validationErrors = validateReferral(newReferral);
        const filteredErrors = {};
        Object.keys(validationErrors).forEach((key) => {
            if (touched[key] || isSubmitted) {
                filteredErrors[key] = validationErrors[key];
            }
        });
        setErrors(filteredErrors);
    }, [newReferral, touched, isSubmitted]);

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const tabs = [
        { key: 'ledger', label: 'Transaction Ledger' },
        { key: 'referrals', label: 'Referral List' }
    ];
    const getTabIndex = (key) => tabs.findIndex(tab => tab.key === key);

    // Tab switch handler
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === 'referrals') {
            fetchReferralRecords();
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Transaction & Referrals</h2>
            {/* Summary Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {summaryCards.map((item, index) => {
                    let value = item.value;
                    if (item.title === "Balance Points") {
                        // Remove commas for calculation, then format again
                        let numericValue = Number(String(value).replace(/,/g, '')) || 0;
                        value = numericValue - pendingEncashAmount;
                    }
                    // Ensure value always has two decimal places
                    const displayValue = typeof value === "number"
                        ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : value;
                    return (
                        <div
                            key={index}
                            className="flex-1 rounded-lg p-4 flex items-center gap-4 border border-gray-200"
                        >
                            <div className="bg-[#FA46151A] rounded-full w-16 h-16 flex items-center justify-center">
                                <span className="text-3xl text-[#A78847]">✦</span>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">{item.title}</div>
                                <div className="text-xl font-bold">{displayValue} Points</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Tabs UI and Refer & Earn Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10">
                <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex p-2 w-full">
                    <div
                        className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
                        style={{
                            width: `${100 / tabs.length}%`,
                            transform: `translateX(${getTabIndex(activeTab) * 100}%)`,
                        }}
                    ></div>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabSwitch(tab.key)}
                            className={`relative z-10 cursor-pointer flex-1 py-2 text-sm sm:text-base rounded-full font-normal transition-colors duration-300 ${
                                activeTab === tab.key ? "text-white" : "text-black"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                    REFER & EARN
                </button>
            </div>
            {/* Referral Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative my-4 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Refer Someone</h2>
                        {/* First Name */}
                        <label htmlFor="referral-first-name" className="block mb-1 font-medium">First Name</label>
                        <input
                            id="referral-first-name"
                            type="text"
                            placeholder="First Name"
                            value={newReferral.firstName || ""}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 50);
                                setNewReferral({ ...newReferral, firstName: value });
                            }}
                            onBlur={() => handleBlur("firstName")}
                            className="w-full mb-4 p-2 border rounded"
                            maxLength="50"
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mb-2">{errors.firstName}</p>}
                        {/* Last Name */}
                        <label htmlFor="referral-last-name" className="block mb-1 font-medium">Last Name</label>
                        <input
                            id="referral-last-name"
                            type="text"
                            placeholder="Last Name"
                            value={newReferral.lastName || ""}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 50);
                                setNewReferral({ ...newReferral, lastName: value });
                            }}
                            onBlur={() => handleBlur("lastName")}
                            className="w-full mb-4 p-2 border rounded"
                            maxLength="50"
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mb-2">{errors.lastName}</p>}
                        {/* Phone */}
                        <label htmlFor="referral-phone" className="block mb-1 font-medium">Phone Number</label>
                        <input
                            id="referral-phone"
                            type="tel"
                            placeholder="Phone Number (10 digits starting with 6-9)"
                            value={newReferral.phone || ""}
                            onChange={(e) => {
                                // Only allow digits and limit to 10 characters
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setNewReferral({ ...newReferral, phone: value });
                            }}
                            onBlur={() => handleBlur("phone")}
                            className="w-full mb-4 p-2 border rounded"
                            maxLength="10"
                            pattern="[6-9][0-9]{9}"
                        />
                        {errors.phone && <p className="text-sm text-red-500 mb-2">{errors.phone}</p>}
                        {/* Rating Dropdown */}
                        <label htmlFor="referral-rating" className="block mb-1 font-medium">Rating</label>
                        <select
                            id="referral-rating"
                            value={newReferral.rating || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, rating: e.target.value })}
                            onBlur={() => handleBlur("rating")}
                            className="w-full mb-4 p-2 border rounded"
                        >
                            <option value="">Select Rating</option>
                            <option value="Hot">Hot</option>
                            <option value="Warm">Warm</option>
                            <option value="Cold">Cold</option>
                        </select>
                        {errors.rating && <p className="text-sm text-red-500 mb-2">{errors.rating}</p>}
                        {/* Project Interested Dropdown */}
                        <label htmlFor="referral-project-interested" className="block mb-1 font-medium">Project Interested</label>
                        <select
                            id="referral-project-interested"
                            value={newReferral.projectInterested || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, projectInterested: e.target.value })}
                            onBlur={() => handleBlur("projectInterested")}
                            className="w-full mb-4 p-2 border rounded"
                        >
                            <option value="">Project Interested</option>
                            <option value="Piramal Aranya">Piramal Aranya</option>
                            <option value="Piramal Mahalaxmi">Piramal Mahalaxmi</option>
                            <option value="Piramal Revanta">Piramal Revanta</option>
                            <option value="Piramal Vaikunth">Piramal Vaikunth</option>
                        </select>
                        {errors.projectInterested && <p className="text-sm text-red-500 mb-2">{errors.projectInterested}</p>}
                        {/* Type of Customer Dropdown */}
                        <label htmlFor="referral-type-customer" className="block mb-1 font-medium">Type of Customer</label>
                        <select
                            id="referral-type-customer"
                            value={newReferral.typeOfCustomer || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, typeOfCustomer: e.target.value })}
                            onBlur={() => handleBlur("typeOfCustomer")}
                            className="w-full mb-4 p-2 border rounded"
                        >
                            <option value="">Type of Customer</option>
                            <option value="Individual">Individual</option>
                            <option value="Company">Company</option>
                        </select>
                        {errors.typeOfCustomer && <p className="text-sm text-red-500 mb-2">{errors.typeOfCustomer}</p>}
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 cursor-pointer py-2 bg-gray-300 text-gray-800 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded"
                                disabled={isSubmitted} // Prevent multiple submissions
                                onClick={async () => {
                                    if (isSubmitted) return; // Prevent double submit
                                    setIsSubmitted(true);
                                    const validationErrors = validateReferral(newReferral);
                                    if (Object.keys(validationErrors).length > 0) {
                                        setErrors(validationErrors);
                                        setTouched({
                                            firstName: true,
                                            lastName: true,
                                            phone: true,
                                            rating: true,
                                            projectInterested: true,
                                            typeOfCustomer: true,
                                        });
                                        setIsSubmitted(false); // Allow retry after validation error
                                        return;
                                    }
                                    try {
                                        const accessToken = localStorage.getItem("salesforce_access_token");
                                        let loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                                        const instanceUrl = localStorage.getItem("salesforce_instance_url");

                                        // Check if phone number already exists for this user (regardless of project)
                                        const checkDuplicateQuery = `SELECT Id FROM Lead WHERE Phone = '${newReferral.phone}' AND Loyalty_Member_Unique_Id__c = '${loyaltyId}' LIMIT 1`;
                                        const checkUrl = `${instanceUrl}/services/data/v64.0/query/?q=${encodeURIComponent(checkDuplicateQuery)}`;

                                        const duplicateCheckResponse = await axios.get(checkUrl, {
                                            headers: {
                                                Authorization: `Bearer ${accessToken}`,
                                                "Content-Type": "application/json",
                                            },
                                        });

                                        if (duplicateCheckResponse.data?.records && duplicateCheckResponse.data.records.length > 0) {
                                            toast.error("Referral already exists.");
                                            setIsSubmitted(false);
                                            return;
                                        }

                                        const body = {
                                            firstName: newReferral.firstName || "",
                                            lastName: newReferral.lastName || "",
                                            Phone: newReferral.phone || "",
                                            Rating: newReferral.rating || "Hot",
                                            LeadSource: "Lockated-PRL-Loyalty",
                                            Project_Interested__c: newReferral.projectInterested || "",
                                            Type_of_Customer__c: newReferral.typeOfCustomer || "Individual",
                                            Loyalty_Member_Unique_Id__c: loyaltyId || "",
                                        };
                                        await axios.post(
                                            `${instanceUrl}/services/data/v64.0/sobjects/Lead/`,
                                            body,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                    "Content-Type": "application/json",
                                                },
                                            }
                                        );
                                        toast.success("Lead created successfully!");
                                        setShowModal(false);
                                        // Fetch updated transactions and summary cards after referral
                                        await fetchTransactions();
                                        await fetchSummaryCards();
                                    } catch (err) {
                                        toast.error("Failed to create lead.");
                                    } finally {
                                        setIsSubmitted(false); // Reset for next attempt
                                    }
                                }}
                            >
                                Add Referral
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Tab Content */}
            {activeTab === 'ledger' && (
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-red-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Date & Time</th>
                                <th className="px-4 py-3">Transaction Type</th>
                                <th className="px-4 py-3">Transaction Name</th>
                                <th className="px-4 py-3 text-right">Earned Points</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 px-4 py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                [...transactions].map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3">
                                            {item?.created_at
                                                ? new Date(item.created_at).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "--"}
                                        </td>
                                        <td className="px-4 py-3 capitalize">
                                            {item?.transaction_type || "--"}
                                        </td>
                                        <td className="px-4 py-3">{item?.remarks || "--"}</td>
                                        <td className="px-4 py-3 text-right">
                                            {typeof item?.points === "number"
                                                ? formatPoints(item.points)
                                                : item?.points || "--"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 px-4 py-4">
                                        No transactions available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'referrals' && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Referral List</h3>
                    {referralLoading ? (
                        <div className="text-gray-500">Loading referrals...</div>
                    ) : referralRecords.length === 0 ? (
                        <div className="text-gray-500">No referrals found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-orange-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Record Type</th>
                                        <th className="px-4 py-3">Stage</th>
                                        <th className="px-4 py-3">Project Name</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {[...referralRecords].reverse().map((rec, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3">{rec.name || '--'}</td>
                                            <td className="px-4 py-3">{rec.recordType || '--'}</td>
                                            <td className="px-4 py-3">{rec.stageName || '--'}</td>
                                            <td className="px-4 py-3">{rec.projectName || '--'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Transactions;