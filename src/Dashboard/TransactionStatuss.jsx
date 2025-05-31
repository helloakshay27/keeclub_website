import React from 'react';

const pointsData = {
  earned: 120,
  redeemed: 50,
  balanced: 70,
};

const transactions = [
  {
    date: '2024-06-01',
    type: 'Earned',
    points: 60,
  },
  {
    date: '2024-06-05',
    type: 'Redeemed',
    points: -30,
  },
  {
    date: '2024-06-10',
    type: 'Earned',
    points: 60,
  },
  {
    date: '2024-06-12',
    type: 'Redeemed',
    points: -20,
  },
];

const TransactionStatus = () => {
  return (
    <div className="p-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-6 text-center rounded-2xl" style={{ border: "1px solid #DFE2E6" }}>
          <p className="text-xl ">%</p>
          <p className="text-lg ">ALL THE POINTS EARNED</p>
          <p className="text-2xl ">{pointsData.earned}</p>
        </div>
        <div className="p-6 text-center rounded-2xl" style={{ border: "1px solid #DFE2E6" }}>
          <p className="text-xl ">%</p>
          <p className="text-lg ">ALL THE POINTS REDEEMED</p>
          <p className="text-2xl ">{pointsData.redeemed}</p>
        </div>
        <div className="p-6 text-center rounded-2xl" style={{ border: "1px solid #DFE2E6" }}>
          <p className="text-lg ">BALANCED POINTS</p>
          <p className="text-xl ">{pointsData.balanced}</p>
        </div>
      </div>

      <h2 className="text-orange-600 text-xl mb-4">TRANSACTION STATUS</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#DFE2E6] rounded-lg">
          <thead>
            <tr className="bg-[#F6EFF5] text-center">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Transaction Type</th>
              <th className="py-2 px-4 border-b">Points</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="text-center border-b hover:bg-gray-100">
                <td className="py-3 px-4 border-r">{tx.date}</td>
                <td className="py-3 px-4 border-r">{tx.type}</td>
                <td className="py-3 px-4 border-r">{tx.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionStatus;
