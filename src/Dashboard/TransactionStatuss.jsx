import React from 'react';

const TransactionStatus = () => {
  return (
    <div className="p-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className=" p-6 text-center rounded-2xl" style={{border: "1px solid #DFE2E6"}}>
          <p className="text-xl ">%</p>
          <p className="text-lg ">ALL THE POINTS EARNED</p>
          <p className="text-2xl ">0</p>
        </div>
        <div className=" p-6 text-center rounded-2xl" style={{border: "1px solid #DFE2E6"}}>
          <p className="text-xl ">%</p>
          <p className="text-lg ">ALL THE POINTS REDEEMED</p>
          <p className="text-2xl ">0</p>
        </div>
        <div className=" p-6 text-center rounded-2xl" style={{border: "1px solid #DFE2E6"}}>
          <p className="text-xl ">0</p>
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
        <div className="grid grid-cols-3 text-center py-4">
          <div>-</div>
          <div>-</div>
          <div>-</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
