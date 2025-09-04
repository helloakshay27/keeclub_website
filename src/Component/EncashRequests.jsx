import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../Confi/baseurl";

const EncashRequests = ({ memberData }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!memberData?.user_id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("salesforce_access_token");
        const res = await fetch(
          `${BASE_URL}/encash_requests.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch encash requests");
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : data.requests || []);
      } catch (err) {
        toast.error("Failed to load encash requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [memberData]);

  if (!memberData?.user_id) {
    return (
      <div className="text-center text-gray-500 py-8">
        Please log in to view your encash requests.
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Encash Requests</h2>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f9461c]"></div>
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No encash requests found.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <div key={req.id || idx} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                Request #{req.id}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${req.status === 'completed' ? 'bg-green-100 text-green-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{req.status || '--'}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-2">
                                            <div className="flex"><span className="font-medium w-32 inline-block">Date</span><span className="">{req.created_at ? new Date(req.created_at).toLocaleString('en-IN') : '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Points</span><span className="">{req.points_to_encash?.toLocaleString('en-IN') || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Amount</span><span className="">₹{req.amount_payable?.toLocaleString('en-IN') || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">Branch</span><span className="">{req.branch_name || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">IFSC</span><span className="">{req.ifsc_code || '--'}</span></div>
                                            <div className="flex"><span className="font-medium w-32 inline-block">User Name</span><span className="">{req.person_name || '--'}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EncashRequests;
