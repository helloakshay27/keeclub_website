import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import hotel1 from "../assets/Hotel/hotel1.jpg";
import hotel2 from "../assets/Hotel/hotel2.jpg";
import hotel3 from "../assets/Hotel/hotel3.jpg";
import { toast } from "react-toastify";
import BASE_URL from "../Confi/baseurl";
import Redemptions from "../Pages/Redemptions";
import Encash from "../Pages/Encash";
import EncashRequests from "../Component/EncashRequests";
import promotionAPI from "../services/promotionAPI";
import Card1 from "../assets/Hotel/Card1.png";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ...other imports as needed...

const TransactionStatuss = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("referrals");
  const [selectedRedemptionTab, setSelectedRedemptionTab] = useState("Featured Products");
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add wallet data state
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    console.log("TransactionStatuss id param:", id);
    // ...existing fetch logic...
  }, [id]);

  // ...rest of your component logic (uncomment and use as needed)...

  return (
    <div>
      <h2>Transaction Status Page</h2>
      <p>Transaction ID: {id}</p>
      {/* ...rest of your UI... */}
    </div>
  );
};

export default TransactionStatuss;
//   const [referrals, setReferrals] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newReferral, setNewReferral] = useState({});
//   const [pirmalData, setPirmalData] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [showTierBenefit, setShowTierBenefit] = useState(false);
//   const [promotionData, setPromotionData] = useState([]);
//   const [promotionLoading, setPromotionLoading] = useState(false);

//   const tabs = [
//     { key: "referrals", label: "My Referrals" },
//     { key: "transactions", label: "Transaction Ledger" },
//     { key: "redemptions", label: "My Redemption" },
//     { key: "orders", label: "My Orders" },
//   ];

//   // My Orders tab state and logic
//   const [orders, setOrders] = useState([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [ordersError, setOrdersError] = useState(null);
//   const [selectedOrderFilter, setSelectedOrderFilter] = useState("All");

//   useEffect(() => {
//     if (selectedTab === "orders") {
//       fetchOrders();
//     }
//     // eslint-disable-next-line
//   }, [selectedTab]);

//   const fetchOrders = async () => {
//     setOrdersLoading(true);
//     setOrdersError(null);
//     try {
//       const authToken = localStorage.getItem("authToken");
//       const memberId = localStorage.getItem("member_id");
//       if (
//         !authToken ||
//         !memberId ||
//         authToken === "null" ||
//         memberId === "null"
//       ) {
//         setOrdersError("Please login to access your orders.");
//         setOrders([]);
//         setOrdersLoading(false);
//         return;
//       }
//       const response = await promotionAPI.getUserOrders();
//       if (response.success) {
//         setOrders(response.data.orders);
//       } else {
//         setOrdersError("Failed to load orders");
//         setOrders([]);
//       }
//     } catch (error) {
//       setOrdersError("Network error while loading orders");
//       setOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const getOrderStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
//       confirmed: { color: "bg-blue-100 text-blue-800", text: "Confirmed" },
//       processing: {
//         color: "bg-indigo-100 text-indigo-800",
//         text: "Processing",
//       },
//       shipped: { color: "bg-purple-100 text-purple-800", text: "Shipped" },
//       delivered: { color: "bg-green-100 text-green-800", text: "Delivered" },
//       cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
//       refunded: { color: "bg-gray-100 text-gray-800", text: "Refunded" },
//     };
//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
//       >
//         {config.text}
//       </span>
//     );
//   };

//   const formatOrderDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };
//   const getTabIndex = (key) => tabs.findIndex((tab) => tab.key === key);

//   useEffect(() => {
//     const fetchPiramlaData = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}get_all_projects.json`);
//         setPirmalData(response.data?.projects || []);
//       } catch (error) {
//         console.error("Error fetching project data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPiramlaData();
//   }, []);

//   // Fetch promotions data when redemptions tab is selected
//   useEffect(() => {
//     if (
//       selectedTab === "redemptions" &&
//       selectedRedemptionTab === "Featured Products"
//     ) {
//       fetchPromotions();
//     }
//   }, [selectedTab, selectedRedemptionTab]);

//   const fetchPromotions = async () => {
//     setPromotionLoading(true);
//     try {
//       const response = await promotionAPI.getPromotions({ category: "All" });
//       if (response.success) {
//         setPromotionData(response.data);
//       } else {
//         // Fallback to static data if API fails
//         setPromotionData([
//           {
//             id: 1,
//             name: "Tissot Watch",
//             title: "Tissot T-Race MotoGP Quartz Chronograph (2025)",
//             currentPrice: 65000,
//             originalPrice: 85000,
//             points: 65000,
//             image: Card1,
//             category: "Luxury",
//             featured: true,
//             description: "Exclusive of all taxes EMI from ₹ 5851",
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching promotions:", error);
//       setPromotionData([]);
//     } finally {
//       setPromotionLoading(false);
//     }
//   };

//   const fetchMemberData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}loyalty/members/${id}.json`);
//       setMemberData(response.data || null);
//       if (response.data) {
//         sessionStorage.setItem("memberData", JSON.stringify(response.data));
//       } else {
//         sessionStorage.removeItem("memberData");
//       }
//     } catch (error) {
//       console.error("Error fetching member data:", error);
//       setMemberData(null);
//       sessionStorage.removeItem("memberData");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMemberData();
//   }, [id]);

//   // Store user_id in localStorage when memberData is available
//   useEffect(() => {
//     if (memberData?.user_id) {
//       localStorage.setItem("userId", memberData.user_id);
//     }
//   }, [memberData]);

//   // Always keep sessionStorage in sync if memberData changes (for any reason)
//   useEffect(() => {
//     if (memberData) {
//       sessionStorage.setItem("memberData", JSON.stringify(memberData));
//     } else {
//       sessionStorage.removeItem("memberData");
//     }
//   }, [memberData]);

//   const fetchReferrals = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${BASE_URL}referrals.json?access_token=${token}`
//       );
//       setReferrals(response.data.referrals || []);
//     } catch (error) {
//       console.error("Error fetching referrals:", error);
//     }
//   };
//   // My Orders Tab UI block (moved to main return)

//   useEffect(() => {
//     if (selectedTab === "referrals") fetchReferrals();
//   }, [selectedTab]);

//   useEffect(() => {
//     if (showModal) {
//       setNewReferral({});
//       setTouched({});
//       setErrors({});
//       setIsSubmitted(false);
//     }
//   }, [showModal]);

//   useEffect(() => {
//     const validationErrors = validateReferral(newReferral);
//     const filteredErrors = {};
//     Object.keys(validationErrors).forEach((key) => {
//       if (touched[key] || isSubmitted) {
//         filteredErrors[key] = validationErrors[key];
//       }
//     });
//     setErrors(filteredErrors);
//   }, [newReferral, touched, isSubmitted]);

//   const handleAddReferral = async () => {
//     setIsSubmitted(true);
//     const validationErrors = validateReferral(newReferral);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setTouched({
//         projectId: true,
//         name: true,
//         phone: true,
//         date: true,
//       });
//       return;
//     }

//     const token = localStorage.getItem("authToken");

//     try {
//       const payload = {
//         customer_code: memberData?.user_id,
//         ref_name: newReferral.name,
//         ref_phone: newReferral.phone,
//         status: "Pending",
//         project_id: newReferral.projectId,
//         referred_on: newReferral.date,
//         referral_mode: "Dashboard Static",
//       };

//       console.log("memberData:-", memberData);
//       console.log("payload:-", payload);

//       const response = await axios.post(
//         `${BASE_URL}add_referral.json?access_token=${token}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         await fetchReferrals();
//         const memberResp = await axios.get(
//           `${BASE_URL}loyalty/members/${id}.json`
//         );
//         setMemberData(memberResp.data || null);
//         if (memberResp.data) {
//           sessionStorage.setItem("memberData", JSON.stringify(memberResp.data));
//         } else {
//           sessionStorage.removeItem("memberData");
//         }
//         setReferrals((prev) => [...prev, response.data.referral]);
//         setNewReferral({});
//         setShowModal(false);
//         setErrors({});
//         setTouched({});
//         setIsSubmitted(false);
//         toast.success("Referral added successfully!");
//       }
//     } catch (error) {
//       if (error.response?.status === 422 && error.response?.data?.mobile) {
//         toast.error(
//           "This phone number has already been referred by this user for this project."
//         );
//       }
//     }
//   };

//    // Add function to fetch wallet details from Salesforce
//   const fetchWalletDetails = async () => {
//     setWalletLoading(true);
//     setWalletError(null);
//     try {
//       // This will fail due to CORS, which is expected
//       const memberName = "PRLxLM-100000";
//       const salesforceToken = "00DIp0000000WGU!AQEAQAibqjH_a7k6Z58qt.Jnik1plTgzNCKPjbS5CWHTxiRQOcll9NpVCmYAsGKPJx5mA5zVaj3ZpdqfPN2a6hbW59_8GPaa";
//       const salesforceUrl = `https://piramal-realty--preprd.sandbox.my.salesforce.com/services/data/v64.0/query/?q=SELECT+Id,Name,Loyalty_Balance__c,Opportunity__c,Phone_Mobile_Number__c,Total_Points_Credited__c,Total_Points_Debited__c,Total_Points_Expired__c,Active__c+FROM+Loyalty_Member__c+WHERE+Name+='${memberName}'`;

//       const response = await axios.get(salesforceUrl, {
//         headers: {
//           'Authorization': `Bearer ${salesforceToken}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log("Salesforce Response:", response.data);
//       if (response.data && response.data.records && response.data.records.length > 0) {
//         setWalletData(response.data.records[0]);
//       } else {
//         setWalletError("No wallet data found");
//         setWalletData(null);
//       }
//     } catch (error) {
//       console.error("Error fetching wallet details:", error);
      
//       // This handles the CORS error gracefully
//       if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
//         console.log("CORS error detected - API call blocked by browser security");
//         setWalletError("Unable to fetch live data due to browser security restrictions. Using existing member data.");
//         setWalletData(null); // Falls back to memberData
//       } else {
//         setWalletError(`Failed to fetch wallet details: ${error.message}`);
//         setWalletData(null);
//       }
//     } finally {
//       setWalletLoading(false);
//     }
//   };

//   const validateReferral = (referral) => {
//     const errors = {};

//     if (!referral.projectId) {
//       errors.projectId = "Please select a project.";
//     }

//     if (!referral.name || referral.name.trim().length < 2) {
//       errors.name = "Name must be at least 2 characters long.";
//     }

//     if (!referral.phone || !/^\d{10}$/.test(referral.phone)) {
//       errors.phone = "Phone number must be 10 digits.";
//     }

//     // if (!referral.date) {
//     //   errors.date = "Please select a date.";
//     // }

//     return errors;
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//   };

//   // Format price as INR with Indian comma separators
//   const formatPrice = (price) => {
//     if (typeof price !== "number") return price;
//     return price.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//   };

//   // Format points with Indian comma separators
//   const formatPoints = (points) => {
//     if (typeof points !== "number") return points;
//     return points.toLocaleString("en-IN");
//   };

//   // Helper function to truncate description
//   const truncateDescription = (description, maxLength = 60) => {
//     if (!description) return "";
//     if (description.length <= maxLength) return description;
//     return description.substring(0, maxLength).trim() + "...";
//   };

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (!memberData)
//     return (
//       <div className="text-center mt-8 text-red-500">Member not found.</div>
//     );

//   // Update summary cards to use wallet data
//   const summaryCards = walletData
//     ? [
//         {
//           title: "Earned Points",
//           value: formatPoints(walletData.Total_Credit_Txn_Amount__c || 0),
//         },
//         {
//           title: "Redeemed Points",
//           value: formatPoints(walletData.Total_Debit_Txn_Amount__c || 0),
//         },
//         {
//           title: "Expired Points",
//           value: formatPoints(walletData.Total_Expired_Txn_Amount__c || 0),
//         },
//         {
//           title: "Balance Points",
//           value: formatPoints(walletData.Loyalty_Balance__c || 0),
//         },
//       ]
//     : [
//         {
//           title: "Earned Points",
//           value: formatPoints(memberData?.earned_points || 0),
//         },
//         {
//           title: "Redeemed Points",
//           value: formatPoints(memberData?.reedem_points || 0),
//         },
//         {
//           title: "Expired Points",
//           value: formatPoints(memberData?.expired_points || 0),
//         },
//         {
//           title: "Balance Points",
//           value: formatPoints(memberData?.current_loyalty_points || 0),
//         },
//       ];

//   // Update the current points calculation to use wallet data if available
//   const currentPoints =
//     walletData?.Loyalty_Balance__c || memberData?.current_loyalty_points || 0;

//   console.log("Member Data:", memberData);

//   const transactions = Array.isArray(memberData?.member_transactions)
//     ? memberData.member_transactions
//     : [];

//   const redemptionsCards = [
//     {
//       title: "Hotels",
//       subtitle: "Exclusive stays unlocked",
//       action: "View Reward",
//       image: hotel1,
//     },
//     {
//       title: "F & B",
//       subtitle: "Special discounts available",
//       action: "View Discount",
//       image: hotel2,
//     },
//     {
//       title: "Tickets",
//       subtitle: "Journey for Less",
//       action: "View Discount",
//       image: hotel3,
//     },
//   ];

//   const allTiers = memberData?.tier_progress?.all_tiers || [];

//   let currentTier = "--";

//   // Loop through all tiers and find the highest tier where currentPoints >= exit_points
//   for (let i = 0; i < allTiers.length; i++) {
//     const tier = allTiers[i];
//     // console.log(
//     //   `Current Points: ${currentPoints}, Tier: ${tier.name}, Exit Points: ${tier.exit_points}`
//     // );
//     if (currentPoints >= tier.exit_points) {
//       currentTier = tier.name;
//     }
//   }

//   const tierBenefits = [
//     {
//       tier: "Bronze",
//       title: "Bronze Tier",
//       points: [
//         "Every purchase earns you reward points that bring you closer to exclusive experiences.",
//         "You’ll be invited to member-only events, receive curated monthly recommendations, and get a warm welcome gift as a new member.",
//         "This tier opens the door to thoughtful perks and sets the stage for something truly rewarding.",
//         "It’s the foundation for your relationship with Kee Club personal, consistent, and curated with care.",
//       ],
//     },
//     {
//       tier: "Silver",
//       title: "Silver Tier",
//       points: [
//         "As a Silver member, you’re celebrated with extra care. You earn points at a faster pace and get access to new arrivals and sales before anyone else.",
//         "Your birthday is special here we’ll make sure of it with a curated surprise just for you. Enjoy complimentary standard shipping, priority assistance from our support team, and seasonal offers crafted for your preferences.",
//         "With Silver, you step into a space where service is smoother, selections are smarter, and your loyalty is felt.",
//       ],
//     },
//     {
//       tier: "Gold",
//       title: "Gold Tier",
//       points: [
//         "Gold membership is an invitation to go deeper with Kee Club.",
//         "Enjoy faster rewards, free express shipping, and a dedicated line for quicker support.",
//         "You’ll be among the first to access new collections and exclusive drops, with personal invitations to member-only experiences. Receive curated gifts for special milestones, thoughtful service throughout your journey, and styling or shopping recommendations based on your tastes.",
//         "Gold is more than a tier it’s a partnership built on trust, taste, and attention.",
//       ],
//     },
//     {
//       tier: "Platinum",
//       title: "Platinum Tier",
//       points: [
//         "Platinum is our most exclusive tier, designed for those who truly live the brand.",
//         "Your rewards accelerate even further, and your service becomes white-glove. A dedicated concierge is available for personalized styling, private previews, and seamless support.",
//         "Enjoy luxury gifting, access to high-touch brand experiences, and invitations to exclusive dinners, launches, or one-on-one sessions. You’ll also receive special recognition, early reservations, and priority access to limited-edition pieces.",
//       ],
//     },
//     {
//       tier: "Titanium",
//       title: "Titanium Tier",
//       points: [
//         "Titanium is our most exclusive tier, designed for those who truly live the brand.",
//         "Your rewards accelerate even further, and your service becomes white-glove. A dedicated concierge is available for personalized styling, private previews, and seamless support.",
//         "Enjoy luxury gifting, access to high-touch brand experiences, and invitations to exclusive dinners, launches, or one-on-one sessions. You’ll also receive special recognition, early reservations, and priority access to limited-edition pieces.",
//       ],
//     },
//   ];

//   // Find benefit for current tier
//   const benefit = tierBenefits.find(
//     (tier) => tier.tier.toLowerCase() === currentTier.toLowerCase()
//   );

//   // Dynamic star image
//   const starImagePath =
//     currentTier !== "--" ? `/${currentTier.toLowerCase()}-star.png` : null;

 

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {/* Header */}

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
//         <p className="text-lg font-semibold">
//           {currentTier === "--" ? (
//             "You are not in any tier"
//           ) : (
//             <span>
//               You are on the{" "}
//               <span className="text-orange-500 font-bold capitalize">
//                 {currentTier}
//               </span>{" "}
//               Tier!
//             </span>
//           )}
//         </p>

//         <button
//           href="#"
//           onClick={() => setShowModal(true)}
//           className="text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
//         >
//           REFER & EARN
//         </button>
//       </div>

//       {/* Progress Section */}
//       <div className="bg-white border border-gray-300 rounded-lg mt-4 p-5 sm:p-7 shadow-sm flex flex-col md:flex-row gap-9 md:gap-40 items-center relative">
//         {/* Info Icon Top-Right */}
//         <div
//           className="absolute top-1 right-1 z-10 group"
//           style={{ minWidth: 40 }}
//         >
//           <div className="flex items-center relative">
//             {/* Info Icon */}
//             <span
//               className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fa46151a] text-[#fa4615] cursor-pointer relative transition-all duration-4000"
//               style={{
//                 boxShadow: "0 2px 8px 0 rgba(250,70,22,0.08)",
//                 zIndex: 2,
//               }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="w-5 h-5"
//               >
//                 <circle
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="#fa4615"
//                   strokeWidth="2"
//                   fill="#fff"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 16v-4m0-4h.01"
//                   stroke="#fa4615"
//                   strokeWidth="2"
//                 />
//               </svg>
//             </span>
//             {/* Sliding Message */}
//             <span
//               className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-[#fa4615] text-[#fa4615] px-3 py-1 rounded shadow text-xs font-semibold whitespace-nowrap
//         transition-all duration-500 ease-in-out
//         opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-hover:right-9"
//               style={{
//                 boxShadow: "0 2px 8px 0 rgba(250,70,22,0.08)",
//                 transformOrigin: "right center",
//                 willChange: "opacity, transform, right",
//                 pointerEvents: "none",
//               }}
//             >
//               1 Point = 1 Rupee
//             </span>
//           </div>
//         </div>
//         <div className="w-full md:w-[100%]">
//           {(() => {
//             const tierProgressData = memberData?.tier_progress;
//             if (
//               !tierProgressData ||
//               !tierProgressData.all_tiers ||
//               tierProgressData.all_tiers.length === 0
//             ) {
//               return (
//                 <div className="text-center text-gray-500">
//                   Tier information not available.
//                 </div>
//               );
//             }

//             const allTiers = tierProgressData.all_tiers;
//             const currentPoints = memberData.current_loyalty_points || 0;
//             const numTiers = allTiers.length;
//             const maxPoints = allTiers[numTiers - 1].exit_points;

//             // Find current segment index
//             let currentTierIndex = 0;
//             for (let i = 0; i < numTiers; i++) {
//               if (currentPoints < allTiers[i].exit_points) {
//                 currentTierIndex = i;
//                 break;
//               }
//               if (i === numTiers - 1) {
//                 currentTierIndex = numTiers - 1;
//               }
//             }

//             // Calculate points range for current segment
//             const prevExit =
//               currentTierIndex === 0
//                 ? 0
//                 : allTiers[currentTierIndex - 1].exit_points;
//             const nextExit = allTiers[currentTierIndex].exit_points;
//             const segmentRange = nextExit - prevExit;
//             const segmentProgress =
//               segmentRange > 0
//                 ? (currentPoints - prevExit) / segmentRange
//                 : 0.0;

//             // Calculate dot position: center of current segment
//             const segmentWidthPercent = 100 / numTiers;
//             const dotLeftPercent =
//               currentTierIndex * segmentWidthPercent + segmentWidthPercent / 2;

//             const pointsNeeded = maxPoints - currentPoints;

//             return (
//               <>
//                 {/* Top Text & Points */}
//                 <div className="flex justify-between text-sm text-gray-700 flex-wrap">
//                   <div className="mb-3 font-medium text-gray-900 uppercase">
//                     {pointsNeeded > 0
//                       ? `YOU NEED ${formatPoints(
//                           pointsNeeded
//                         )} POINTS TO REACH THE HIGHEST TIER!`
//                       : "You are in the highest tier!"}
//                   </div>

//                   <div className="flex items-center text-sm mb-1">
//                     <span className="text-lg font-bold text-gray-900">
//                       {formatPoints(currentPoints)}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-1">
//                       /{formatPoints(maxPoints)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Tier Bar */}
//                 <div
//                   className="relative w-full h-2.5 bg-gray-200 rounded-full mt-2 flex items-center"
//                   style={{ borderRadius: "999px" }}
//                 >
//                   {allTiers.map((tier, index) => {
//                     // Fill color for completed segments
//                     let fill = "bg-transparent";
//                     if (index < currentTierIndex) fill = "bg-red-600";
//                     if (index === currentTierIndex) fill = "bg-red-600";

//                     // Remove right border-radius for filled segments except the last one
//                     const isFilled = index < currentTierIndex;
//                     const isCurrent = index === currentTierIndex;
//                     const isFirst = index === 0;

//                     let borderRadiusStyle = {};
//                     if (isFirst) {
//                       // Only the very first segment has full left rounding
//                       borderRadiusStyle = {
//                         borderTopLeftRadius: "999px",
//                         borderBottomLeftRadius: "999px",
//                         borderTopRightRadius: 0,
//                         borderBottomRightRadius: 0,
//                       };
//                     } else {
//                       // All other segments have no rounding
//                       borderRadiusStyle = {
//                         borderRadius: 0,
//                       };
//                     }

//                     return (
//                       <div
//                         key={index}
//                         style={{
//                           width: `${segmentWidthPercent}%`,
//                           borderRadius: "0px",
//                         }}
//                         className="relative h-full overflow-hidden"
//                       >
//                         <div
//                           className={`h-full ${fill} transition-all`}
//                           style={{
//                             width:
//                               index < currentTierIndex
//                                 ? "100%"
//                                 : index === currentTierIndex
//                                 ? "50%"
//                                 : "0%",
//                             ...borderRadiusStyle,
//                           }}
//                         ></div>
//                       </div>
//                     );
//                   })}
//                   {/* Progress dot centered in current segment with tooltip */}
//                   <div
//                     className="absolute top-1/2 -translate-y-1/2 bg-red-600 rounded-full border-2 border-white shadow-lg transition-all group"
//                     style={{
//                       left: `calc(${dotLeftPercent}% - 10px)`,
//                       width: "20px",
//                       height: "20px",
//                       boxShadow: "0 2px 8px 0 rgba(250,70,22,0.25)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                       {formatPoints(currentPoints)} pts
//                     </div>
//                   </div>
//                 </div>

//                 {/* Tier Labels */}
//                 <div className="flex text-xs mt-3 text-gray-700 w-full relative">
//                   {/* Empty space for 0-point start */}
//                   <div
//                     style={{
//                       flexBasis: `${100 / allTiers.length / 2}%`,
//                       textAlign: "left",
//                     }}
//                   ></div>
//                   {allTiers.map((tier, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         flexBasis: `${100 / allTiers.length}%`,
//                         textAlign:
//                           index === 0
//                             ? "left"
//                             : index === allTiers.length - 1
//                             ? "right"
//                             : "center",
//                         position:
//                           index === allTiers.length - 1
//                             ? "absolute"
//                             : "relative",
//                         right: index === allTiers.length - 1 ? 0 : undefined,
//                         left:
//                           index === 0
//                             ? `calc(${100 / allTiers.length / 2}% - 0.5rem)`
//                             : undefined,
//                         transform:
//                           index === allTiers.length - 1
//                             ? "translateX(50%)"
//                             : undefined,
//                       }}
//                       className="relative"
//                     >
//                       <span className="cursor-default group relative inline-block">
//                         {/* Tooltip on hover of span only */}
//                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                           {formatPoints(tier.exit_points)} pts
//                         </div>
//                         {tier.name}
//                       </span>
//                     </div>
//                   ))}
//                   {/* Empty space for end alignment */}
//                   <div
//                     style={{
//                       flexBasis: `${100 / allTiers.length / 2}%`,
//                       textAlign: "right",
//                     }}
//                   ></div>
//                 </div>
//               </>
//             );
//           })()}
//         </div>

//         <div className="md:items-end">
//           <button
//             onClick={() => setShowTierBenefit(!showTierBenefit)}
//             className="bg-gray-900 text-white px-4 py-3 md:py-4 rounded text-sm font-medium uppercase whitespace-nowrap"
//           >
//             {showTierBenefit ? "HIDE TIER BENEFITS" : "VIEW TIER BENEFITS"}
//           </button>
//         </div>
//       </div>
//       {showTierBenefit && (
//         <div className="mt-6">
//           <div
//             className={`flex flex-wrap gap-6 ${
//               tierBenefits.length % 2 === 1
//                 ? "justify-start sm:justify-center"
//                 : "justify-start"
//             }`}
//           >
//             {tierBenefits.map((tier, index) => {
//               const isLast = index === tierBenefits.length - 1;
//               const isOdd = tierBenefits.length % 2 === 1;
//               // If last and odd, center the last card on desktop
//               const cardClass =
//                 isLast && isOdd
//                   ? "w-full sm:w-[48%] mx-auto"
//                   : "w-full sm:w-[48%]";
//               return (
//                 <div
//                   key={index}
//                   className={`relative transition-all duration-300 ease-in-out border border-gray-300 rounded-lg bg-[#e8ecf7] p-6 sm:p-8 shadow-md overflow-hidden ${cardClass}`}
//                 >
//                   {/* Decorative Background Stars */}
//                   <img
//                     src={`/${tier.tier.toLowerCase()}-star.png`}
//                     alt="star"
//                     className="absolute w-8 h-8 top-4 left-4 opacity-20 pointer-events-none"
//                   />
//                   <img
//                     src={`/${tier.tier.toLowerCase()}-star.png`}
//                     alt="star"
//                     className="absolute w-6 h-6 bottom-8 left-10 opacity-10 pointer-events-none"
//                   />
//                   <img
//                     src={`/${tier.tier.toLowerCase()}-star.png`}
//                     alt="star"
//                     className="absolute w-24 h-24 top-3 right-3 opacity-100 pointer-events-none"
//                   />
//                   <img
//                     src={`/${tier.tier.toLowerCase()}-star.png`}
//                     alt="star"
//                     className="absolute w-10 h-10 bottom-4 right-10 opacity-20 pointer-events-none"
//                   />
//                   {/* Benefit Card Content */}
//                   <div className="relative z-10 pr-10">
//                     <h3 className="text-xl font-semibold text-[#d6451d] mb-3">
//                       {tier.title}
//                     </h3>
//                     <ul className="list-disc list-outside px-6 text-gray-800 space-y-2 text-sm leading-relaxed">
//                       {tier.points.map((point, idx) => (
//                         <li key={idx} className="pl-1">
//                           {point}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Summary Cards */}
//       <div className="flex justify-between gap-4 mt-6">
//         {walletLoading ? (
//           <div className="flex-1 rounded-lg p-4 flex items-center justify-center border border-gray-200">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fa4615]"></div>
//             <span className="ml-2 text-gray-600">Loading wallet...</span>
//           </div>
//         ) : walletError ? (
//           <div className="flex-1 rounded-lg p-4 flex items-center justify-center border border-red-200 bg-red-50">
//             <span className="text-red-600 text-sm">{walletError}</span>
//             <button
//               onClick={fetchWalletDetails}
//               className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
//             >
//               Retry
//             </button>
//           </div>
//         ) : (
//           summaryCards.map((item, index) => (
//             <div
//               key={index}
//               className="flex-1 rounded-lg p-4 flex items-center gap-4 border border-gray-200"
//             >
//               <div className="bg-[#FA46151A] rounded-full w-16 h-16 flex items-center justify-center">
//                 <span className="text-3xl text-[#A78847]">✦</span>
//               </div>
//               <div>
//                 <div className="text-sm text-gray-500">{item.title}</div>
//                 <div className="text-xl font-bold">{item.value} Points</div>
//                 {walletData && (
//                   <div className="text-xs text-green-600 mt-1">✓ Live data</div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10">
//         <div className="relative bg-[#FAFAFA] border border-gray-300 rounded-full flex p-2 w-full">
//           <div
//             className="absolute top-1 left-1 h-[90%] bg-[#F9461C] rounded-full transition-all duration-300"
//             style={{
//               width: `${100 / tabs.length}%`,
//               transform: `translateX(${getTabIndex(selectedTab) * 100}%)`,
//             }}
//           ></div>
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setSelectedTab(tab.key)}
//               className={`relative z-10 cursor-pointer flex-1 py-2 text-sm sm:text-base rounded-full font-normal transition-colors duration-300 ${
//                 selectedTab === tab.key ? "text-white" : "text-black"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors whitespace-nowrap"
//         >
//           REFER & EARN
//         </button>
//       </div>

//       {/* My Redemption with Sub-tabs */}
//       {selectedTab === "redemptions" && (
//         <div className="mt-6">
//           {/* Sub-tab Navigation */}
//           <div className="w-full mb-6 px-4">
//             <div className="flex justify-center">
//               <div
//                 className="flex bg-gray-100 rounded-full w-4/5 mx-auto border border-gray-200"
//                 style={{ padding: "4px" }}
//               >
//                 {[
//                   "Featured Products",
//                   // "Redemption Market Place",
//                   "Encash",
//                   "My Encash Requests",
//                 ].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setSelectedRedemptionTab(tab)}
//                     className={`flex-1 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
//                       selectedRedemptionTab === tab
//                         ? "bg-[#f9461c] text-white shadow-md"
//                         : "text-gray-600 hover:text-gray-800"
//                     }`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sub-tab Content */}
//           {selectedRedemptionTab === "Featured Products" && (
//             <>
//               {/* Promotions Grid */}
//               <div className="px-4 pt-2 pb-4 max-w-7xl mx-auto">
//                 {promotionLoading ? (
//                   <div className="flex justify-center items-center py-20">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9461c]"></div>
//                     <span className="ml-3 text-gray-600">
//                       Loading promotions...
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {promotionData.map((item) => (
//                       <div
//                         key={item.id}
//                         className="flex flex-col justify-between bg-white rounded-[12px] overflow-hidden min-h-[440px] transition-all duration-300"
//                         style={{
//                           boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.15)",
//                           borderBottom: "2px solid #f9461c",
//                         }}
//                       >
//                         {/* Watch Image */}
//                         <div
//                           className="flex justify-center items-end bg-white pt-8 pb-2 px-4"
//                           style={{ minHeight: 230 }}
//                         >
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="h-56 object-contain"
//                             style={{ maxHeight: "200px" }}
//                           />
//                         </div>
//                         {/* Card Content */}
//                         <div className="flex flex-col flex-1 px-8 pb-8 pt-2">
//                           <h3 className="text-xl font-bold mb-1">
//                             {item.name}
//                           </h3>
//                           {item.originalPrice > item.currentPrice && (
//                             <div className="text-base text-gray-400 font-semibold line-through mb-1">
//                               {formatPrice(item.originalPrice)}
//                             </div>
//                           )}
//                           {/* <div
//                             className="text-2xl text-[#B3B3B3] font-bold mb-2"
//                             style={{
//                               textDecoration: "line-through",
//                               fontSize: "16px",
//                             }}
//                           >
//                             {formatPrice(item.currentPrice)}
//                           </div> */}
//                           {/* Redeem Row */}
//                           <div
//                             className=" mb-6"
//                             style={{ fontSize: "14px", fontWeight: "bold" }}
//                           >
//                             <span className="text-gray-500 mr-2">
//                               Redeem using
//                             </span>
//                             <span className="flex items-center text-[#000]">
//                               <img
//                                 src="/redeemStar.png"
//                                 alt="star"
//                                 className="mr-1"
//                                 style={{
//                                   width: 24,
//                                   height: 24,
//                                   display: "inline-block",
//                                 }}
//                               />
//                               {typeof item.points === "number"
//                                 ? item.points.toLocaleString("en-IN")
//                                 : item.points}
//                             </span>
//                           </div>
//                           {/* View Details Button */}
//                           <div className="flex justify-end mt-auto">
//                             <Link
//                               to={`/promotion-detail/${item.id}`}
//                               className="bg-[#24293c] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#1a1f2e] transition-colors duration-300 shadow-none"
//                               style={{ minWidth: 170, textAlign: "center" }}
//                             >
//                               View Details
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {selectedRedemptionTab === "Redemption Market Place" && (
//             <div className="px-4">
//               <Redemptions />
//             </div>
//           )}

//           {selectedRedemptionTab === "Encash" && (
//             <div className="px-4">
//               <Encash
//                 memberData={memberData}
//                 setSelectedRedemptionTab={setSelectedRedemptionTab}
//               />
//             </div>
//           )}

//           {selectedRedemptionTab === "My Encash Requests" && (
//             <div className="px-4">
//               <EncashRequests memberData={memberData} />
//             </div>
//           )}
//         </div>
//       )}

//       {/* Transactions */}
//       {selectedTab === "transactions" && (
//         <div className="overflow-x-auto mt-6">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-red-100 text-gray-600 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Date & Time</th>
//                 <th className="px-4 py-3">Transaction Type</th>
//                 <th className="px-4 py-3">Transaction Name</th>
//                 <th className="px-4 py-3 text-right">Earned Points</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {transactions.length > 0 ? (
//                 [...transactions].reverse().map((item, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-3">
//                       {item?.created_at
//                         ? new Date(item.created_at).toLocaleString("en-US", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "numeric",
//                             minute: "2-digit",
//                             hour12: true,
//                           })
//                         : "--"}
//                     </td>
//                     <td className="px-4 py-3 capitalize">
//                       {item?.transaction_type || "--"}
//                     </td>
//                     <td className="px-4 py-3">{item?.remarks || "--"}</td>
//                     <td className="px-4 py-3 text-right">
//                       {typeof item?.points === "number"
//                         ? formatPoints(item.points)
//                         : item?.points || "--"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="text-center text-gray-500 px-4 py-4"
//                   >
//                     No transactions available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Referrals */}
//       {selectedTab === "referrals" && (
//         <div className="overflow-x-auto mt-6">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-red-100 text-gray-600 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Date</th>
//                 <th className="px-4 py-3">Name referred</th>
//                 <th className="px-4 py-3">Project Name</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Phone</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {referrals.length > 0 ? (
//                 referrals.map((item, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-3">
//                       {item?.created_at
//                         ? new Date(item.created_at).toLocaleString("en-US", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "numeric",
//                             minute: "2-digit",
//                             hour12: true,
//                           })
//                         : "--"}
//                     </td>
//                     <td className="px-4 py-3">{item?.name || "--"}</td>
//                     <td className="px-4 py-3">{item?.project_name || "--"}</td>
//                     <td className="px-4 py-3">{item?.status || "--"}</td>
//                     <td className="px-4 py-3">{item?.mobile || "--"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="text-center text-gray-500 px-4 py-4"
//                   >
//                     No referrals available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* My Orders Tab */}
//       {selectedTab === "orders" && (
//         <div className="mt-6">
//           <div className="max-w-6xl mx-auto px-4">
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 My Orders
//               </h1>
//               <p className="text-gray-600">
//                 Track and manage your recent orders
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm mb-6">
//               <div className="flex flex-wrap border-b">
//                 {[
//                   "All",
//                   "Pending",
//                   "Confirmed",
//                   "Shipped",
//                   "Delivered",
//                   "Cancelled",
//                 ].map((filter) => (
//                   <button
//                     key={filter}
//                     onClick={() => setSelectedOrderFilter(filter)}
//                     className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                       selectedOrderFilter === filter
//                         ? "border-[#fa4615] text-[#fa4615]"
//                         : "border-transparent text-gray-600 hover:text-gray-800"
//                     }`}
//                   >
//                     {filter} (
//                     {filter === "All"
//                       ? orders.length
//                       : orders.filter(
//                           (o) => o.status.toLowerCase() === filter.toLowerCase()
//                         ).length}
//                     )
//                   </button>
//                 ))}
//               </div>
//             </div>
//             {ordersLoading ? (
//               <div className="flex items-center justify-center min-h-96">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fa4615] mx-auto mb-4"></div>
//                   <p className="text-gray-600">Loading your orders...</p>
//                 </div>
//               </div>
//             ) : ordersError ? (
//               <div className="flex items-center justify-center min-h-96">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-bold text-red-600 mb-4">
//                     Error
//                   </h2>
//                   <p className="text-gray-600 mb-4">{ordersError}</p>
//                   <button
//                     onClick={fetchOrders}
//                     className="bg-[#fa4615] text-white px-6 py-2 rounded hover:bg-[#e63e0f]"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               (() => {
//                 const filteredOrders = orders.filter((order) => {
//                   if (selectedOrderFilter === "All") return true;
//                   return (
//                     order.status.toLowerCase() ===
//                     selectedOrderFilter.toLowerCase()
//                   );
//                 });
//                 if (filteredOrders.length === 0) {
//                   return (
//                     <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                       <span className="mx-auto h-16 w-16 text-gray-400 mb-4 flex items-center justify-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="currentColor"
//                           className="w-16 h-16"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M3 3v1.5A2.25 2.25 0 005.25 6.75h13.5A2.25 2.25 0 0021 4.5V3M3 3l1.5 18.75A2.25 2.25 0 006.75 24h10.5a2.25 2.25 0 002.25-2.25L21 3M3 3h18"
//                           />
//                         </svg>
//                       </span>
//                       <h3 className="text-lg font-medium text-gray-800 mb-2">
//                         No orders found
//                       </h3>
//                       <p className="text-gray-600 mb-6">
//                         {selectedOrderFilter === "All"
//                           ? "You haven't placed any orders yet."
//                           : `No ${selectedOrderFilter.toLowerCase()} orders found.`}
//                       </p>
//                     </div>
//                   );
//                 }
//                 return (
//                   <div className="space-y-4">
//                     {filteredOrders.map((order) => (
//                       <div
//                         key={order.id}
//                         className="bg-white rounded-lg shadow-sm overflow-hidden"
//                       >
//                         <div className="p-6">
//                           <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
//                             <div className="flex items-center space-x-4 mb-4 lg:mb-0">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-gray-800">
//                                   Order #{order.orderNumber}
//                                 </h3>
//                                 <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
//                                   <span className="flex items-center">
//                                     {/* Calendar icon */}
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       strokeWidth={1.5}
//                                       stroke="currentColor"
//                                       className="w-4 h-4 mr-1"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 004.5 7.5v11.25A2.25 2.25 0 006.75 24h10.5a2.25 2.25 0 002.25-2.25L21 3M3 3h18"
//                                       />
//                                     </svg>
//                                     {formatOrderDate(order.createdAt)}
//                                   </span>
//                                   <span className="flex items-center">
//                                     {/* Package icon */}
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       strokeWidth={1.5}
//                                       stroke="currentColor"
//                                       className="w-4 h-4 mr-1"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M21 12.75V6.375a2.25 2.25 0 00-1.072-1.91l-6.75-4.05a2.25 2.25 0 00-2.356 0l-6.75 4.05A2.25 2.25 0 003 6.375V12.75m18 0v6.375a2.25 2.25 0 01-1.072 1.91l-6.75 4.05a2.25 2.25 0 01-2.356 0l-6.75-4.05A2.25 2.25 0 013 19.125V12.75m18 0l-9 5.4m0 0l-9-5.4"
//                                       />
//                                     </svg>
//                                     {order.totalItems} item
//                                     {order.totalItems > 1 ? "s" : ""}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-3">
//                               {getOrderStatusBadge(order.status)}
//                             </div>
//                           </div>
//                           <div className="space-y-4">
//                             {order.orderItems.map((item) => (
//                               <div
//                                 key={item.id}
//                                 className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
//                               >
//                                 <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                                   {item.product?.primaryImage ? (
//                                     <img
//                                       src={item.product.primaryImage}
//                                       alt={item.product.name}
//                                       className="w-full h-full object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-full h-full flex items-center justify-center">
//                                       <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth={1.5}
//                                         stroke="currentColor"
//                                         className="w-6 h-6 text-gray-400"
//                                       >
//                                         <path
//                                           strokeLinecap="round"
//                                           strokeLinejoin="round"
//                                           d="M21 12.75V6.375a2.25 2.25 0 00-1.072-1.91l-6.75-4.05a2.25 2.25 0 00-2.356 0l-6.75 4.05A2.25 2.25 0 003 6.375V12.75m18 0v6.375a2.25 2.25 0 01-1.072 1.91l-6.75 4.05a2.25 2.25 0 01-2.356 0l-6.75-4.05A2.25 2.25 0 013 19.125V12.75m18 0l-9 5.4m0 0l-9-5.4"
//                                         />
//                                       </svg>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="flex-1">
//                                   <h4 className="font-medium text-gray-800">
//                                     {item.product?.name || item.itemName}
//                                   </h4>
//                                   {item.product?.sku && (
//                                     <p className="text-sm text-gray-600">
//                                       SKU: {item.product.sku}
//                                     </p>
//                                   )}
//                                   <p className="text-sm text-gray-600">
//                                     Quantity: {item.quantity}
//                                   </p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-medium text-gray-800">
//                                     ₹
//                                     {typeof item.totalPrice === "number"
//                                       ? item.totalPrice.toLocaleString("en-IN")
//                                       : item.totalPrice}
//                                   </p>
//                                   {order.loyaltyPointsRedeemed > 0 && (
//                                     <div className=" flex text-sm text-orange-600">
//                                       <span className="flex items-center text-[#000]">
//                                         <img
//                                           src="/redeemStar.png"
//                                           alt="star"
//                                           className="mr-1"
//                                           style={{
//                                             width: 24,
//                                             height: 24,
//                                             display: "inline-block",
//                                           }}
//                                         />
//                                         {typeof item.points === "number"
//                                           ? item.points.toLocaleString("en-IN")
//                                           : item.points}
//                                       </span>
//                                       {typeof order.loyaltyPointsRedeemed ===
//                                       "number"
//                                         ? order.loyaltyPointsRedeemed.toLocaleString(
//                                             "en-IN"
//                                           )
//                                         : order.loyaltyPointsRedeemed}{" "}
//                                       points used
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                           <div className="mt-4 pt-4 border-t border-gray-200">
//                             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
//                               <div className="flex items-center space-x-4 mb-4 lg:mb-0">
//                                 {order.shippingAddress && (
//                                   <div className="flex items-start text-sm text-gray-600">
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                       strokeWidth={1.5}
//                                       stroke="currentColor"
//                                       className="w-4 h-4 mr-1 mt-1"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
//                                       />
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
//                                       />
//                                     </svg>
//                                     <div>
//                                       <p>
//                                         {order.shippingAddress.address},
//                                         {order.shippingAddress.address_line_two
//                                           ? ` ${order.shippingAddress.address_line_two},`
//                                           : ""}{" "}
//                                         {order.shippingAddress.address_line_three
//                                           ? ` ${order.shippingAddress.address_line_three},`
//                                           : ""}{" "}
//                                       </p>
//                                       <p>
//                                         {order.shippingAddress.city},
//                                         {order.shippingAddress.state} -{" "}
//                                         {order.shippingAddress.pin_code}
//                                       </p>
//                                       <div
//                                         className="flex items-center text-sm text-gray-600 mt-1"
//                                         style={{ marginLeft: "-20px" }}
//                                       >
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           fill="none"
//                                           viewBox="0 0 24 24"
//                                           strokeWidth={1.5}
//                                           stroke="currentColor"
//                                           className="w-4 h-4 mr-1"
//                                         >
//                                           <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v7.125A2.625 2.625 0 007.125 19.5h9.75a2.625 2.625 0 002.625-2.625V9.75a2.625 2.625 0 00-2.625-2.625h-15A2.625 2.625 0 004.5 9.75v11.25A2.625 2.625 0 007.125 19.5h9.75a2.625 2.625 0 002.625-2.625V9.75"
//                                           />
//                                         </svg>
//                                         <span className="capitalize">
//                                           {order.paymentStatus}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-lg font-semibold text-gray-800">
//                                   Total: ₹
//                                   {typeof order.totalAmount === "number"
//                                     ? order.totalAmount.toLocaleString("en-IN")
//                                     : order.totalAmount}
//                                 </p>
//                                 {order.loyaltyDiscountAmount > 0 && (
//                                   <p className="text-sm text-green-600">
//                                     Saved: ₹
//                                     {typeof order.loyaltyDiscountAmount ===
//                                     "number"
//                                       ? order.loyaltyDiscountAmount.toLocaleString(
//                                           "en-IN"
//                                         )
//                                       : order.loyaltyDiscountAmount}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })()
//             )}
//           </div>
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
//             >
//               <X size={20} />
//             </button>
//             <h2 className="text-lg font-semibold mb-4">Refer Someone</h2>
//             <select
//               value={newReferral.projectId || ""}
//               onChange={(e) =>
//                 setNewReferral({ ...newReferral, projectId: e.target.value })
//               }
//               onBlur={() => handleBlur("projectId")}
//               className="w-full mb-4 p-2 border rounded"
//             >
//               <option value="">Select Project</option>
//               {pirmalData.map((option) => (
//                 <option key={option.id} value={option.id}>
//                   {option.project_name}
//                 </option>
//               ))}
//             </select>
//             {errors.projectId && (
//               <p className="text-sm text-red-500 mb-2">{errors.projectId}</p>
//             )}

//             <input
//               type="text"
//               placeholder="Name"
//               value={newReferral.name || ""}
//               onChange={(e) =>
//                 setNewReferral({ ...newReferral, name: e.target.value })
//               }
//               onBlur={() => handleBlur("name")}
//               className="w-full mb-4 p-2 border rounded"
//             />
//             {errors.name && (
//               <p className="text-sm text-red-500 mb-2">{errors.name}</p>
//             )}

//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={newReferral.phone || ""}
//               onChange={(e) =>
//                 setNewReferral({ ...newReferral, phone: e.target.value })
//               }
//               onBlur={() => handleBlur("phone")}
//               className="w-full mb-4 p-2 border rounded"
//             />
//             {errors.phone && (
//               <p className="text-sm text-red-500 mb-2">{errors.phone}</p>
//             )}

//             {/* <input
//               type="date"
//               value={newReferral.date || ""}
//               onChange={(e) =>
//                 setNewReferral({ ...newReferral, date: e.target.value })
//               }
//               onBlur={() => handleBlur("date")}
//               className="w-full mb-4 p-2 border rounded"
//             />
//             {errors.date && <p className="text-sm text-red-500 mb-2">{errors.date}</p>} */}

//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 cursor-pointer py-2 bg-gray-300 text-gray-800 rounded"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 cursor-pointer bg-orange-500 text-white rounded"
//                 onClick={handleAddReferral}
//               >
//                 Add Referral
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

/* Duplicate TransactionStatuss component and export removed to fix multiple default exports error */

