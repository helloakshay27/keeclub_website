import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from '../Confi/baseurl';

const EncashDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [encashDetails, setEncashDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEncashDetails = async () => {
            try {
                setLoading(true);
                const authToken = localStorage.getItem('authToken');
                
                if (!authToken) {
                    toast.error('Please login to view details');
                    navigate('/login');
                    return;
                }

                const response = await fetch(
                    `${BASE_URL}encash_requests/${id}/encashment_detail.json?is_admin=true`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch encash details');
                }

                const data = await response.json();
                setEncashDetails(data);
            } catch (err) {
                console.error('Error fetching encash details:', err);
                setError(err.message);
                toast.error('Failed to load encash details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEncashDetails();
        }
    }, [id, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return '--';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const openDocument = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading encash details...</p>
                </div>
            </div>
        );
    }

    if (error || !encashDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error || 'Failed to load details'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Encash Request Details</h1>
                            <p className="text-gray-600 mt-1">Request ID: #{encashDetails.id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusBadgeClass(encashDetails.status)}`}>
                            {encashDetails.status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Financial Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Financial Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Points to Encash</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {encashDetails.points_to_encash?.toLocaleString('en-IN') || '0'}
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Facilitation Fee</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ₹{encashDetails.facilitation_fee?.toLocaleString('en-IN') || '0'}
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 sm:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Amount Payable</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        ₹{encashDetails.amount_payable?.toLocaleString('en-IN') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Bank Account Details
                            </h2>
                            <div className="space-y-3">
                                <div className="flex border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium w-40">Account Holder:</span>
                                    <span className="text-gray-900 font-semibold">{encashDetails.person_name || '--'}</span>
                                </div>
                                <div className="flex border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium w-40">Account Number:</span>
                                    <span className="text-gray-900 font-mono">{encashDetails.account_number || '--'}</span>
                                </div>
                                <div className="flex border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium w-40">IFSC Code:</span>
                                    <span className="text-gray-900 font-mono">{encashDetails.ifsc_code || '--'}</span>
                                </div>
                                <div className="flex pb-3">
                                    <span className="text-gray-600 font-medium w-40">Branch Name:</span>
                                    <span className="text-gray-900">{encashDetails.branch_name || '--'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        {encashDetails.transaction_mode && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Transaction Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex border-b border-gray-100 pb-3">
                                        <span className="text-gray-600 font-medium w-40">Transaction Mode:</span>
                                        <span className="text-gray-900">{encashDetails.transaction_mode || '--'}</span>
                                    </div>
                                    <div className="flex pb-3">
                                        <span className="text-gray-600 font-medium w-40">Transaction Number:</span>
                                        <span className="text-gray-900 font-mono">{encashDetails.transaction_number || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Referral Information */}
                        {encashDetails.referral_name && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Referral Information
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex border-b border-gray-100 pb-3">
                                        <span className="text-gray-600 font-medium w-40">Referral Name:</span>
                                        <span className="text-gray-900">{encashDetails.referral_name || '--'}</span>
                                    </div>
                                    <div className="flex border-b border-gray-100 pb-3">
                                        <span className="text-gray-600 font-medium w-40">Application Value:</span>
                                        <span className="text-gray-900">₹{encashDetails.application_value?.toLocaleString('en-IN') || '--'}</span>
                                    </div>
                                    {encashDetails.booking_unit && (
                                        <div className="flex pb-3">
                                            <span className="text-gray-600 font-medium w-40">Booking Unit:</span>
                                            <span className="text-gray-900">{encashDetails.booking_unit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Documents & Timeline */}
                    <div className="space-y-6">
                        {/* KYC Documents */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                KYC Documents
                            </h2>
                            <div className="space-y-3">
                                {/* Aadhar Document */}
                                {encashDetails.adhar_doc && (
                                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">Aadhar Card</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {encashDetails.adhar_doc.document_file_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openDocument(encashDetails.adhar_doc.document_url)}
                                                className="ml-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium transition-colors"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* PAN Document */}
                                {encashDetails.pan_doc && (
                                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">PAN Card</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {encashDetails.pan_doc.document_file_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openDocument(encashDetails.pan_doc.document_url)}
                                                className="ml-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium transition-colors"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Cheque Document */}
                                {encashDetails.cheque_doc && (
                                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">Cancelled Cheque</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {encashDetails.cheque_doc.document_file_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openDocument(encashDetails.cheque_doc.document_url)}
                                                className="ml-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium transition-colors"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Status Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium w-32">Created:</span>
                                    <span className="text-gray-900 text-sm">{formatDate(encashDetails.created_at)}</span>
                                </div>
                                <div className="flex border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium w-32">Updated:</span>
                                    <span className="text-gray-900 text-sm">{formatDate(encashDetails.updated_at)}</span>
                                </div>
                                <div className="flex pb-3">
                                    <span className="text-gray-600 font-medium w-32">Payment Status:</span>
                                    <span className={`text-sm font-medium ${encashDetails.is_payment_deducted ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {encashDetails.is_payment_deducted ? 'Deducted' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Terms Acceptance */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                {encashDetails.terms_accepted ? (
                                    <>
                                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-green-600 font-medium">Terms & Conditions Accepted</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-red-600 font-medium">Terms Not Accepted</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EncashDetails;
