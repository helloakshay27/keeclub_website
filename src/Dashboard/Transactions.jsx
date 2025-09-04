
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
  return (
    <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <p className="text-lg font-semibold">
          {currentTier === "--" ? (
            "You are not in any tier"
          ) : (
            <span>
              You are on the{" "}
              {/* <span className="text-orange-500 font-bold capitalize">
                {currentTier}
              </span>{" "} */}
              Tier!
            </span>
          )}
        </p>

        <button
          href="#"
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          REFER & EARN
        </button>
      </div>

      {/* Progress Section */}
      <div className="bg-white border border-gray-300 rounded-lg mt-4 p-5 sm:p-7 shadow-sm flex flex-col md:flex-row gap-9 md:gap-40 items-center relative">
        {/* Info Icon Top-Right */}
        {/* <div
          className="absolute top-1 right-1 z-10 group"
          style={{ minWidth: 40 }}
        >
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
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-[#fa4615] text-[#fa4615] px-3 py-1 rounded shadow text-xs font-semibold whitespace-nowrap
        transition-all duration-500 ease-in-out
        opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-hover:right-9"
              style={{
                boxShadow: "0 2px 8px 0 rgba(250,70,22,0.08)",
                transformOrigin: "right center",
                willChange: "opacity, transform, right",
                pointerEvents: "none",
              }}
            >
              1 Point = 1 Rupee
            </span>
          </div>
        </div>
        <div className="w-full md:w-[100%]">
          {(() => {
            const tierProgressData = memberData?.tier_progress;
            if (
              !tierProgressData ||
              !tierProgressData.all_tiers ||
              tierProgressData.all_tiers.length === 0
            ) {
              return (
                <div className="text-center text-gray-500">
                  Tier information not available.
                </div>
              );
            }

            const allTiers = tierProgressData.all_tiers;
            const currentPoints = memberData.current_loyalty_points || 0;
            const numTiers = allTiers.length;
            const maxPoints = allTiers[numTiers - 1].exit_points;

            // Find current segment index
            let currentTierIndex = 0;
            for (let i = 0; i < numTiers; i++) {
              if (currentPoints < allTiers[i].exit_points) {
                currentTierIndex = i;
                break;
              }
              if (i === numTiers - 1) {
                currentTierIndex = numTiers - 1;
              }
            }

            // Calculate points range for current segment
            const prevExit =
              currentTierIndex === 0
                ? 0
                : allTiers[currentTierIndex - 1].exit_points;
            const nextExit = allTiers[currentTierIndex].exit_points;
            const segmentRange = nextExit - prevExit;
            const segmentProgress =
              segmentRange > 0
                ? (currentPoints - prevExit) / segmentRange
                : 0.0;

            // Calculate dot position: center of current segment
            const segmentWidthPercent = 100 / numTiers;
            const dotLeftPercent =
              currentTierIndex * segmentWidthPercent + segmentWidthPercent / 2;

            const pointsNeeded = maxPoints - currentPoints;

            return (
              <>
                <div className="flex justify-between text-sm text-gray-700 flex-wrap">
                  <div className="mb-3 font-medium text-gray-900 uppercase">
                    {pointsNeeded > 0
                      ? `YOU NEED ${formatPoints(
                          pointsNeeded
                        )} POINTS TO REACH THE HIGHEST TIER!`
                      : "You are in the highest tier!"}
                  </div>

                  <div className="flex items-center text-sm mb-1">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPoints(currentPoints)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      /{formatPoints(maxPoints)}
                    </span>
                  </div>
                </div>

                <div
                  className="relative w-full h-2.5 bg-gray-200 rounded-full mt-2 flex items-center"
                  style={{ borderRadius: "999px" }}
                >
                  {allTiers.map((tier, index) => {
                    // Fill color for completed segments
                    let fill = "bg-transparent";
                    if (index < currentTierIndex) fill = "bg-red-600";
                    if (index === currentTierIndex) fill = "bg-red-600";

                    // Remove right border-radius for filled segments except the last one
                    const isFilled = index < currentTierIndex;
                    const isCurrent = index === currentTierIndex;
                    const isFirst = index === 0;

                    let borderRadiusStyle = {};
                    if (isFirst) {
                      // Only the very first segment has full left rounding
                      borderRadiusStyle = {
                        borderTopLeftRadius: "999px",
                        borderBottomLeftRadius: "999px",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      };
                    } else {
                      // All other segments have no rounding
                      borderRadiusStyle = {
                        borderRadius: 0,
                      };
                    }

                    return (
                      <div
                        key={index}
                        style={{
                          width: `${segmentWidthPercent}%`,
                          borderRadius: "0px",
                        }}
                        className="relative h-full overflow-hidden"
                      >
                        <div
                          className={`h-full ${fill} transition-all`}
                          style={{
                            width:
                              index < currentTierIndex
                                ? "100%"
                                : index === currentTierIndex
                                ? "50%"
                                : "0%",
                            ...borderRadiusStyle,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 bg-red-600 rounded-full border-2 border-white shadow-lg transition-all group"
                    style={{
                      left: `calc(${dotLeftPercent}% - 10px)`,
                      width: "20px",
                      height: "20px",
                      boxShadow: "0 2px 8px 0 rgba(250,70,22,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatPoints(currentPoints)} pts
                    </div>
                  </div>
                </div>

                <div className="flex text-xs mt-3 text-gray-700 w-full relative">
                  <div
                    style={{
                      flexBasis: `${100 / allTiers.length / 2}%`,
                      textAlign: "left",
                    }}
                  ></div>
                  {allTiers.map((tier, index) => (
                    <div
                      key={index}
                      style={{
                        flexBasis: `${100 / allTiers.length}%`,
                        textAlign:
                          index === 0
                            ? "left"
                            : index === allTiers.length - 1
                            ? "right"
                            : "center",
                        position:
                          index === allTiers.length - 1
                            ? "absolute"
                            : "relative",
                        right: index === allTiers.length - 1 ? 0 : undefined,
                        left:
                          index === 0
                            ? `calc(${100 / allTiers.length / 2}% - 0.5rem)`
                            : undefined,
                        transform:
                          index === allTiers.length - 1
                            ? "translateX(50%)"
                            : undefined,
                      }}
                      className="relative"
                    >
                      <span className="cursor-default group relative inline-block">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {formatPoints(tier.exit_points)} pts
                        </div>
                        {tier.name}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      flexBasis: `${100 / allTiers.length / 2}%`,
                      textAlign: "right",
                    }}
                  ></div>
                </div>
              </>
            );
          })()}
        </div> */}

        <div className="md:items-end">
          <button
            onClick={() => setShowTierBenefit(!showTierBenefit)}
            className="bg-gray-900 text-white px-4 py-3 md:py-4 rounded text-sm font-medium uppercase whitespace-nowrap"
          >
            {showTierBenefit ? "HIDE TIER BENEFITS" : "VIEW TIER BENEFITS"}
          </button>
        </div>
      </div>
      {showTierBenefit && (
        <div className="mt-6">
          <div
            className={`flex flex-wrap gap-6 ${
              tierBenefits.length % 2 === 1
                ? "justify-start sm:justify-center"
                : "justify-start"
            }`}
          >
            {tierBenefits.map((tier, index) => {
              const isLast = index === tierBenefits.length - 1;
              const isOdd = tierBenefits.length % 2 === 1;
              // If last and odd, center the last card on desktop
              const cardClass =
                isLast && isOdd
                  ? "w-full sm:w-[48%] mx-auto"
                  : "w-full sm:w-[48%]";
              return (
                <div
                  key={index}
                  className={`relative transition-all duration-300 ease-in-out border border-gray-300 rounded-lg bg-[#e8ecf7] p-6 sm:p-8 shadow-md overflow-hidden ${cardClass}`}
                >
                  {/* Decorative Background Stars */}
                  <img
                    src={`/${tier.tier.toLowerCase()}-star.png`}
                    alt="star"
                    className="absolute w-8 h-8 top-4 left-4 opacity-20 pointer-events-none"
                  />
                  <img
                    src={`/${tier.tier.toLowerCase()}-star.png`}
                    alt="star"
                    className="absolute w-6 h-6 bottom-8 left-10 opacity-10 pointer-events-none"
                  />
                  <img
                    src={`/${tier.tier.toLowerCase()}-star.png`}
                    alt="star"
                    className="absolute w-24 h-24 top-3 right-3 opacity-100 pointer-events-none"
                  />
                  <img
                    src={`/${tier.tier.toLowerCase()}-star.png`}
                    alt="star"
                    className="absolute w-10 h-10 bottom-4 right-10 opacity-20 pointer-events-none"
                  />
                  {/* Benefit Card Content */}
                  <div className="relative z-10 pr-10">
                    <h3 className="text-xl font-semibold text-[#d6451d] mb-3">
                      {tier.title}
                    </h3>
                    <ul className="list-disc list-outside px-6 text-gray-800 space-y-2 text-sm leading-relaxed">
                      {tier.points.map((point, idx) => (
                        <li key={idx} className="pl-1">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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