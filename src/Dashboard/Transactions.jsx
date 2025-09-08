import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

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
    return points.toLocaleString("en-IN");
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newReferral, setNewReferral] = useState({});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Get loyalty member data from localStorage
    const loyaltyBalance = Number(localStorage.getItem("Loyalty_Balance__c")) || 0;
    const totalCredited = Number(localStorage.getItem("Total_Points_Credited__c")) || 0;
    const totalDebited = Number(localStorage.getItem("Total_Points_Debited__c")) || 0;
    const totalExpired = Number(localStorage.getItem("Total_Points_Expired__c")) || 0;
    const loyaltyMemberId = localStorage.getItem("Id");
    const mobile = localStorage.getItem("salesforce_mobile");
    const accessToken = localStorage.getItem("salesforce_access_token");

    const summaryCards = [
        {
            title: "Earned Points",
            value: formatPoints(totalCredited),
        },
        {
            title: "Redeemed Points",
            value: formatPoints(totalDebited),
        },
        {
            title: "Expired Points",
            value: formatPoints(totalExpired),
        },
        {
            title: "Balance Points",
            value: formatPoints(loyaltyBalance),
        },
    ];

    // Fetch transactions from Salesforce
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const query = `SELECT Id, Name, Loyalty_Points__c, Loyalty_Member__c, Transaction_Type__c, CreatedDate FROM Loyalty_Transaction__c WHERE Loyalty_Member__r.Phone_Mobile_Number__c = '${mobile}' ORDER BY CreatedDate DESC LIMIT 2000`;
                const url = `https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/query/?q=${encodeURIComponent(query)}`;
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
                        "https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/sobjects/Loyalty_Transaction__c/",
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
        if (mobile && accessToken) fetchTransactions();
    }, [mobile, accessToken, loyaltyMemberId]);

    // Referral Modal validation
    const validateReferral = (referral) => {
        const errors = {};
        if (!referral.firstName || referral.firstName.trim().length < 2) {
            errors.firstName = "First name must be at least 2 characters long.";
        }
        if (!referral.lastName || referral.lastName.trim().length < 2) {
            errors.lastName = "Last name must be at least 2 characters long.";
        }
        if (!referral.phone || !/^\d{10}$/.test(referral.phone)) {
            errors.phone = "Phone number must be 10 digits.";
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

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Transaction Ledger</h2>

            {/* Summary Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {summaryCards.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1 rounded-lg p-4 flex items-center gap-4 border border-gray-200"
                    >
                        <div className="bg-[#FA46151A] rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-3xl text-[#A78847]">✦</span>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{item.title}</div>
                            <div className="text-xl font-bold">{item.value} Points</div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setShowModal(true)}
                className="mb-6 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
                REFER & EARN
            </button>

            {/* Referral Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Refer Someone</h2>
                        {/* First Name */}
                        <input
                            type="text"
                            placeholder="First Name"
                            value={newReferral.firstName || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, firstName: e.target.value })}
                            onBlur={() => handleBlur("firstName")}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mb-2">{errors.firstName}</p>}
                        {/* Last Name */}
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={newReferral.lastName || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, lastName: e.target.value })}
                            onBlur={() => handleBlur("lastName")}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mb-2">{errors.lastName}</p>}
                        {/* Phone */}
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newReferral.phone || ""}
                            onChange={(e) => setNewReferral({ ...newReferral, phone: e.target.value })}
                            onBlur={() => handleBlur("phone")}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        {errors.phone && <p className="text-sm text-red-500 mb-2">{errors.phone}</p>}
                        {/* Rating Dropdown */}
                        <select
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
                        <select
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
                        <select
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
                                onClick={async () => {
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
                                        return;
                                    }
                                    try {
                                        const accessToken = localStorage.getItem("salesforce_access_token");
                                        let loyaltyId = localStorage.getItem("Loyalty_Member_Unique_Id__c") || "";
                                        const body = {
                                            firstName: newReferral.firstName || "",
                                            lastName: newReferral.lastName || "",
                                            Rating: newReferral.rating || "Hot",
                                            LeadSource: "Lockated-PRL-Loyalty",
                                            Project_Interested__c: newReferral.projectInterested || "",
                                            Type_of_Customer__c: newReferral.typeOfCustomer || "Individual",
                                            Loyalty_Member_Unique_Id__c: loyaltyId || "",
                                        };
                                        await axios.post(
                                            "https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/sobjects/Lead/",
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
                                    } catch (err) {
                                        toast.error("Failed to create lead.");
                                    }
                                }}
                            >
                                Add Referral
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
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
        </div>
    );
};

export default Transactions;