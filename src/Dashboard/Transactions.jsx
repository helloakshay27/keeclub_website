import React, { useState } from "react";

const staticMemberData = {
    earned_points: 25000,
    reedem_points: 12000,
    expired_points: 2000,
    current_loyalty_points: 11000,
    member_transactions: [
        {
            created_at: "2025-08-10T08:00:00Z",
            transaction_type: "Credit",
            remarks: "Referral Bonus",
            points: 5000,
        },
        {
            created_at: "2025-08-15T09:30:00Z",
            transaction_type: "Debit",
            remarks: "Redeemed for Watch",
            points: -12000,
        },
        {
            created_at: "2025-08-20T11:00:00Z",
            transaction_type: "Credit",
            remarks: "Promotion Bonus",
            points: 7000,
        },
    ],
};

const summaryCards = [
    {
        title: "Earned Points",
        value: staticMemberData.earned_points,
    },
    {
        title: "Redeemed Points",
        value: staticMemberData.reedem_points,
    },
    {
        title: "Expired Points",
        value: staticMemberData.expired_points,
    },
    {
        title: "Balance Points",
        value: staticMemberData.current_loyalty_points,
    },
];

const formatPoints = (points) => {
    if (typeof points !== "number") return points;
    return points.toLocaleString("en-IN");
};

const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusBadge = (type) => {
    const config =
        type === "Credit"
            ? { color: "bg-green-100 text-green-800", text: "Credit" }
            : { color: "bg-red-100 text-red-800", text: "Debit" };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const Transactions = () => {
    const [transactions] = useState(staticMemberData.member_transactions);
    const [showTierBenefit, setShowTierBenefit] = useState(false);

    let currentTier = "--";

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

    // Get loyalty member data from localStorage
    const loyaltyBalance = Number(localStorage.getItem("Loyalty_Balance__c")) || 0;
    const totalCredited = Number(localStorage.getItem("Total_Points_Credited__c")) || 0;
    const totalDebited = Number(localStorage.getItem("Total_Points_Debited__c")) || 0;
    const totalExpired = Number(localStorage.getItem("Total_Points_Expired__c")) || 0;

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
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">History</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-2">Date</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Remarks</th>
                            <th className="py-2 px-2">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-2">{formatOrderDate(txn.created_at)}</td>
                                    <td className="py-2 px-2">{getStatusBadge(txn.transaction_type)}</td>
                                    <td className="py-2 px-2">{txn.remarks}</td>
                                    <td className="py-2 px-2 font-bold text-orange-600">
                                        {formatPoints(txn.points)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;