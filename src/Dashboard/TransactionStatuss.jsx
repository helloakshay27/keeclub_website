import React from "react";

const pointsData = {
  earned: 1200,
  redeemed: 800,
  balanced: 400,
};

const transactions = [
  {
    date: "2024-06-01",
    type: "Earned",
    points: 500,
  },
  {
    date: "2024-06-05",
    type: "Redeemed",
    points: -300,
  },
  {
    date: "2024-06-10",
    type: "Earned",
    points: 700,
  },
  {
    date: "2024-06-12",
    type: "Redeemed",
    points: -500,
  },
];

const TransactionStatus = () => {
  return (
    <div className="mt-2 mb-2">
      {/* <p className="text-blue-600 hover:underline cursor-pointer mb-4 ps-3">
        <a href="/members">
          <span>Members</span>
        </a>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-500">Member Details</span>
      </p> */}

      {/* Personal Details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h5 className="flex items-center mb-4">
          <span className="text-xl font-semibold">PERSONAL DETAILS</span>
        </h5>
        <div className="text-gray-600 text-base font-normal space-y-2">
          <div className="flex">
            <div className="w-1/3 font-medium">Full name</div>
            <div className="w-2/3">: ROC Trigger Test</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Email Address</div>
            <div className="w-2/3">: shwetajadhav@rustomjee.com</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Phone No.</div>
            <div className="w-2/3">: 7718979739</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Home Address</div>
            <div className="w-2/3">: </div>
          </div>
        </div>
      </div>

      {/* Membership Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h5 className="flex items-center mb-4">
          <span className="text-xl font-semibold">MEMBERSHIP STATUS</span>
        </h5>
        <div className="text-gray-600 text-base font-normal space-y-2">
          <div className="flex">
            <div className="w-1/3 font-medium">Current Loyalty Points</div>
            <div className="w-2/3">: 400</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Tier Progress</div>
            <div className="w-2/3">: Silver</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Membership Duration</div>
            <div className="w-2/3">: 1 days</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Account Status</div>
            <div className="w-2/3">: Active</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Enrolled Date</div>
            <div className="w-2/3">: 30-05-2025</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Tier Level</div>
            <div className="w-2/3">: Silver</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Expiry Points</div>
            <div className="w-2/3">: 0</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mb-8">
        <div className="bg-white border rounded-2xl shadow flex flex-col items-center justify-center p-6 w-64">
          <p className="text-gray-400 text-lg mb-1">%</p>
          <h6 className="font-semibold text-center mb-1">ALL THE POINTS EARNED</h6>
          <h6 className="text-2xl font-bold">{pointsData.earned}</h6>
        </div>
        <div className="bg-white border rounded-2xl shadow flex flex-col items-center justify-center p-6 w-64">
          <p className="text-gray-400 text-lg mb-1">%</p>
          <h6 className="font-semibold text-center mb-1">ALL THE POINTS REDEEMED</h6>
          <h6 className="text-2xl font-bold">{pointsData.redeemed}</h6>
        </div>
        <div className="bg-white border rounded-2xl shadow flex flex-col items-center justify-center p-6 w-64">
          <h6 className="text-2xl font-bold mb-1">{pointsData.balanced}</h6>
          <h6 className="font-semibold text-center">BALANCED POINTS</h6>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-semibold mb-4 pl-2">TRANSACTION STATUS</h5>
        <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6 whitespace-nowrap">{txn.date}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{txn.type}</td>
                  <td
                    className={`py-3 px-6 whitespace-nowrap font-semibold ${
                      txn.points > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-gray-400 text-center py-4">No transactions found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
