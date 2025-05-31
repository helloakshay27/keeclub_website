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
          <p className="text-xl ">{pointsData.balanced}</p>
          <p className="text-lg ">BALANCED POINTS</p>
        </div>
      </div>

      <h2 className="text-orange-600 text-xl  mb-4">TRANSACTION STATUS</h2>

      <div className="overflow-hidden">
        <div className="grid grid-cols-3 bg-[#F6EFF5] text-center  py-2">
          <div>Date</div>
          <div>Transaction Type</div>
          <div>Points</div>
        </div>
        {transactions.map((tx, idx) => (
          <div key={idx} className="grid grid-cols-3 text-center py-4 border-b">
            <div>{tx.date}</div>
            <div>{tx.type}</div>
            <div>{tx.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionStatus;
