
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Ledger</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center"
          >
            <div className="text-sm text-gray-500 mb-1">{card.title}</div>
            <div className="text-xl font-bold text-orange-600">
              {formatPoints(card.value)}
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