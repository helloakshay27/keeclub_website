import React, { useEffect, useState } from "react";
import axios from "axios";

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