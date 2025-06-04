import React, { useState } from "react";
import hotel1 from "../assets/Hotel/hotel1.jpg";
import hotel2 from "../assets/Hotel/hotel2.jpg";
import hotel3 from "../assets/Hotel/hotel3.jpg";

const TransactionStatuss = () => {
  const [selectedTab, setSelectedTab] = useState("redemptions");

  const summaryCards = [
    { title: "Loyalty Points", value: 1600 },
    { title: "Earned Points", value: 700 },
    { title: "Redeemed Points", value: 900 },
  ];

  const transactions = [
    { date: "12/02/2024", type: "Credit", name: "Hotel" },
    { date: "12/02/2024", type: "Debit", name: "F&B" },
    { date: "12/02/2024", type: "Debit", name: "Ticket" },
    { date: "12/02/2024", type: "Credit", name: "Ticket" },
  ]

  const redemptionsCards = [
    {
      title: "Hotels",
      subtitle: "Exclusive stays unlocked",
      action: "View Reward ",
      image: hotel1,
    },
    {
      title: "F & B",
      subtitle: "Special discounts available",
      action: "View Discount",
      image: hotel2,
    },
    {
      title: "Tickets",
      subtitle: "Journey for Less",
      action: "View Discount",
      image: hotel3,
    },
  ];


  const referralsCards = [
    { date: "12/02/2024", name: "Priya Mehra", status: "Registered", points: "+250 pts" },
    { date: "12/02/2024", name: "Rahul Ghosh", status: "Registered", points: "+500 pts" },
    { date: "12/02/2024", name: "Ankit Sharma", status: "In Progress", points: "..." },
    { date: "12/02/2024", name: "Tanya Roy", status: "Joined Event", points: "+100 pts" },
  ]


  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">
          You are on the{" "}
          <span className="text-orange-500 font-bold">Bronze</span> Tier!
        </p>
        <a href="#" className="text-sm text-orange-600 font-semibold">
          REFER & EARN
        </a>
      </div>

      {/* Tier Progress Bar */}
      <div className="bg-white border justify-between flex gap-6 border-gray-300 rounded-lg mt-4 p-7 shadow-sm">
        <div className="w-[70%]">
          <div className="flex justify-between text-sm text-gray-700">
            <div className="text-sm mb-3 font-medium text-gray-900 uppercase">
              YOU NEED 750 POINTS TO UPGRADE ON NEXT TIER!
            </div>
            <div className="flex text-sm mb-1">
              <span className="text-lg font-bold text-gray-900">25</span>
              <span className="text-sm text-gray-500 ml-1">/100 POINTS</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div className="absolute top-[-6px] left-[25%] w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
            <div className="h-2 bg-red-600 rounded-full" style={{ width: "25%" }}></div>
          </div>
          <div className="flex justify-between text-sm mt-3 text-gray-700">
            <span>Bronze</span>
            <span>Silver</span>
            <span>Gold</span>
          </div>
        </div>

        {/* Button */}
        <div className="flex items-center justify-end">
          <button className="bg-gray-900 text-white px-4 py-4 rounded text-sm font-medium uppercase">
            VIEW TIER BENEFITS
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {summaryCards.map((item, index) => (
          <div
            key={index}
            className="rounded-lg p-4 flex items-center gap-4"
            style={{ border: "1.8px solid #f3f4f6" }}
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

      {/* Tabs */}
      <div className="flex justify-center mt-10 font-semibold text-center space-x-4">
        <div
          onClick={() => setSelectedTab("redemptions")}
          className={`cursor-pointer w-1/6 pb-2 ${selectedTab === "redemptions" ? "border-b-2 border-orange-500" : ""}`}
        >
          My Redemptions
        </div>
        <div
          onClick={() => setSelectedTab("transactions")}
          className={`cursor-pointer w-1/6 pb-2 ${selectedTab === "transactions" ? "border-b-2 border-orange-500" : ""}`}
        >
          My Transactions
        </div>
        <div
          onClick={() => setSelectedTab("referrals")}
          className={`cursor-pointer w-1/6 pb-2 ${selectedTab === "referrals" ? "border-b-2 border-orange-500" : ""}`}
        >
          My Referrals
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "redemptions" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {redemptionsCards.map((card, index) => (
            <div key={index} className="rounded overflow-hidden shadow-sm relative group">
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${card.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent"></div>
                <div className="px-4 text-white relative" style={{ top: "1rem" }}>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-xs">{card.subtitle}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-[rgba(255,165,0,0.6)] text-sm font-normal text-white px-4 py-2">
                    {card.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "transactions" && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-red-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Transaction Type</th>
                <th className="px-4 py-3">Transaction Name</th>
                <th className="px-4 py-3">Balanced Points</th>
                <th className="px-4 py-3">Earned Points</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {transactions.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">...</td>
                  <td className="px-4 py-3">...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTab === "referrals" && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-red-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name referred</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Points Earned</th>
                <th className="px-4 py-3">Refer Someone</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {referralsCards.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.points}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="underline ">
                      Refer and earn
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionStatuss;
