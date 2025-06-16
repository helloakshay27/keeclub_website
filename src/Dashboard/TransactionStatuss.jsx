import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import hotel1 from "../assets/Hotel/hotel1.jpg";
import hotel2 from "../assets/Hotel/hotel2.jpg";
import hotel3 from "../assets/Hotel/hotel3.jpg";
import { toast } from "react-toastify";

const TransactionStatuss = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("redemptions");
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReferral, setNewReferral] = useState({});
  const [pirmalData, setPirmalData] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tabs = [
    { key: "redemptions", label: "My Redemptions" },
    { key: "transactions", label: "My Transactions" },
    { key: "referrals", label: "My Referrals" },
  ];
  const getTabIndex = (key) => tabs.findIndex((tab) => tab.key === key);

  useEffect(() => {
    const fetchPiramlaData = async () => {
      try {
        const response = await axios.get(`https://piramal-loyalty-dev.lockated.com/get_all_projects.json`);
        setPirmalData(response.data?.projects || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPiramlaData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const response = await axios.get(`https://piramal-loyalty-dev.lockated.com/loyalty/members/${id}.json`);
      setMemberData(response.data || null);
    } catch (error) {
      console.error("Error fetching member data:", error);
      setMemberData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, [id]);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://piramal-loyalty-dev.lockated.com/referrals.json?access_token=${token}`
      );
      setReferrals(response.data.referrals || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  useEffect(() => {
    if (selectedTab === "referrals") fetchReferrals();
  }, [selectedTab]);

  useEffect(() => {
    if (showModal) {
      setNewReferral({});
      setTouched({});
      setErrors({});
      setIsSubmitted(false);
    }
  }, [showModal]);

  useEffect(() => {
    const validationErrors = validateReferral(newReferral);
    const filteredErrors = {};
    Object.keys(validationErrors).forEach((key) => {
      if (touched[key] || isSubmitted) {
        filteredErrors[key] = validationErrors[key];
      }
    });
    setErrors(filteredErrors);
  }, [newReferral, touched, isSubmitted]);

  const handleAddReferral = async () => {
    setIsSubmitted(true);
    const validationErrors = validateReferral(newReferral);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        projectId: true,
        name: true,
        phone: true,
        date: true,
      });
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const payload = {
        customer_code: memberData.user_id,
        ref_name: newReferral.name,
        ref_phone: newReferral.phone,
        status: "Registered",
        project_id: newReferral.projectId,
        referred_on: newReferral.date,
        referral_mode: "Dashboard Static",
      };

      const response = await axios.post(
        `https://piramal-loyalty-dev.lockated.com/add_referral.json?access_token=${token}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        await fetchReferrals();
        await fetchMemberData();
        setReferrals((prev) => [...prev, response.data.referral]);
        setNewReferral({});
        setShowModal(false);
        setErrors({});
        setTouched({});
        setIsSubmitted(false);
      }
    } catch (error) {
      toast.error("Failed to add referral. Please try again.");
    }
  };

  const validateReferral = (referral) => {
    const errors = {};

    if (!referral.projectId) {
      errors.projectId = "Please select a project.";
    }

    if (!referral.name || referral.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    if (!referral.phone || !/^\d{10}$/.test(referral.phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }

    if (!referral.date) {
      errors.date = "Please select a date.";
    }

    return errors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!memberData) return <div className="text-center mt-8 text-red-500">Member not found.</div>;

  const summaryCards = [
    { title: "Loyalty Points", value: memberData.current_loyalty_points || 0 },
    { title: "Earned Points", value: memberData.earned_points || 0 },
    { title: "Redeemed Points", value: memberData.reedem_points || 0 },
  ];

  const transactions = Array.isArray(memberData.member_transactions) ? memberData.member_transactions : [];

  const redemptionsCards = [
    {
      title: "Hotels",
      subtitle: "Exclusive stays unlocked",
      action: "View Reward",
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <p className="text-lg font-semibold">
          You are on the{" "}
          <span className="text-orange-500 font-bold capitalize">
            {memberData?.member_status?.tier_level || "--"}
          </span>{" "}
          Tier!
        </p>
        <a
          href="#"
          onClick={() => setShowModal(true)}
          className="text-sm text-orange-600 font-semibold"
        >
          REFER & EARN
        </a>
      </div>

      {/* Progress Section */}
      <div className="bg-white border border-gray-300 rounded-lg mt-4 p-5 sm:p-7 shadow-sm flex flex-col md:flex-row gap-9 md:gap-40">
        <div className="w-full md:w-[70%]">
          <div className="flex justify-between text-sm text-gray-700 flex-wrap">
            <div className="mb-3 font-medium text-gray-900 uppercase">
              YOU NEED 750 POINTS TO UPGRADE ON NEXT TIER!
            </div>
            <div className="flex items-center text-sm mb-1">
              <span className="text-lg font-bold text-gray-900">
                {memberData?.current_loyalty_points || 0}
              </span>
              <span className="text-sm text-gray-500 ml-1">/750 POINTS</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="absolute top-[-6px] bg-red-600 rounded-full border-2 border-white"
              style={{
                left: `${memberData?.member_status?.tier_progression || 0}`,
                width: "1rem",
                height: "1rem",
              }}
            ></div>
            <div
              className="h-2 bg-red-600 rounded-full"
              style={{ width: `${memberData?.member_status?.tier_progression || 0}` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-3 text-gray-700">
            <span>Bronze</span>
            <span>Silver</span>
            <span>Gold</span>
          </div>
        </div>
        <div className="flex items-center justify-start md:justify-end">
          <button className="bg-gray-900 text-white px-4 py-3 md:py-4 rounded text-sm font-medium uppercase">
            VIEW TIER BENEFITS
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {summaryCards.map((item, index) => (
          <div
            key={index}
            className="rounded-lg p-4 flex items-center gap-4 border border-gray-200"
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

      <div className="flex justify-center mt-10">
        <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex p-2 w-[320px] sm:w-[800px]">
          <div
            className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${getTabIndex(selectedTab) * 100}%)`,
            }}
          ></div>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`relative z-10 cursor-pointer flex-1 py-2 text-sm sm:text-base rounded-full font-normal transition-colors duration-300 ${selectedTab === tab.key ? "text-white" : "text-black"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Redemptions */}
      {selectedTab === "redemptions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {redemptionsCards.map((card, index) => (
            <Link
              key={index}
              className="rounded overflow-hidden shadow-sm relative group block"
            >
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${card.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent"></div>
                <div className="px-4 text-white relative top-4">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-xs">{card.subtitle}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-[rgba(255,165,0,0.6)] text-sm font-normal text-white px-4 py-2">
                    {card.action}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Transactions */}
      {selectedTab === "transactions" && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-red-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Transaction Type</th>
                <th className="px-4 py-3">Transaction Name</th>
                <th className="px-4 py-3">Earned Points</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {transactions.length > 0 ? (
                transactions.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      {item && item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "--"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {item && item.transaction_type ? item.transaction_type : "--"}
                    </td>
                    <td className="px-4 py-3">
                      {item && item.remarks ? item.remarks : "--"}
                    </td>
                    <td className="px-4 py-3">
                      {item && item.points ? item.points : "--"}
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
      )}

      {/* Referrals */}
      {selectedTab === "referrals" && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-red-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name referred</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {referrals.length > 0 ? (
                referrals.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      {item && item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "--"}
                    </td>
                    <td className="px-4 py-3">{item && item.name ? item.name : "--"}</td>
                    <td className="px-4 py-3">{item && item.status ? item.status : "--"}</td>
                    <td className="px-4 py-3">{item && item.mobile ? item.mobile : "--"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 px-4 py-4">
                    No referrals available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Refer Someone</h2>
            <select
              value={newReferral.projectId || ""}
              onChange={(e) =>
                setNewReferral({ ...newReferral, projectId: e.target.value })
              }
              onBlur={() => handleBlur("projectId")}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select Project</option>
              {pirmalData.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.project_name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="text-sm text-red-500 mb-2">{errors.projectId}</p>}

            <input
              type="text"
              placeholder="Name"
              value={newReferral.name || ""}
              onChange={(e) =>
                setNewReferral({ ...newReferral, name: e.target.value })
              }
              onBlur={() => handleBlur("name")}
              className="w-full mb-4 p-2 border rounded"
            />
            {errors.name && <p className="text-sm text-red-500 mb-2">{errors.name}</p>}

            <input
              type="tel"
              placeholder="Phone Number"
              value={newReferral.phone || ""}
              onChange={(e) =>
                setNewReferral({ ...newReferral, phone: e.target.value })
              }
              onBlur={() => handleBlur("phone")}
              className="w-full mb-4 p-2 border rounded"
            />
            {errors.phone && <p className="text-sm text-red-500 mb-2">{errors.phone}</p>}

            <input
              type="date"
              value={newReferral.date || ""}
              onChange={(e) =>
                setNewReferral({ ...newReferral, date: e.target.value })
              }
              onBlur={() => handleBlur("date")}
              className="w-full mb-4 p-2 border rounded"
            />
            {errors.date && <p className="text-sm text-red-500 mb-2">{errors.date}</p>}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 cursor-pointer py-2 bg-gray-300 text-gray-800 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded"
                onClick={handleAddReferral}
              >
                Add Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatuss;