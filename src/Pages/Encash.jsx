import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionAPI from '../services/promotionAPI';
import { toast } from 'react-toastify';

const Encash = ({ memberData, setSelectedRedemptionTab }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pointsToEncash: '',
        facilitationFees: '',
        amountPayable: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        personName: '',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [encashRequests, setEncashRequests] = useState([]);
    const [encashLoading, setEncashLoading] = useState(false);
    // Fetch encash requests on mount
    useEffect(() => {
        const fetchEncashRequests = async () => {
            setEncashLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    setEncashRequests([]);
                    setEncashLoading(false);
                    return;
                }
                const res = await fetch('https://piramal-loyalty-dev.lockated.com/encash_requests.json', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEncashRequests(Array.isArray(data) ? data : []);
                } else {
                    setEncashRequests([]);
                }
            } catch (error) {
                setEncashRequests([]);
            } finally {
                setEncashLoading(false);
            }
        };
        fetchEncashRequests();
    }, []);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuthentication = () => {
            const authToken = localStorage.getItem('authToken');
            const isLoggedIn = authToken && authToken !== 'null';
            
            if (!isLoggedIn) {
                toast.error('Please login to access the Encash feature');
                navigate('/login'); // Redirect to login page
                return;
            }
            
            setIsCheckingAuth(false);
        };

        checkAuthentication();
    }, [navigate]);

    // Use currentPoints from memberData prop
    const currentPoints = memberData?.current_loyalty_points || 0;

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            
            // Auto-calculate facilitation fees and amount payable
            if (field === 'pointsToEncash' && value) {
                const points = parseInt(value) || 0;
                const fees = Math.round(points * 0.02); // 2% facilitation fee
                const amount = points - fees;
                
                updated.facilitationFees = fees.toString();
                updated.amountPayable = amount.toString();
            }
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check authentication before submission
        const authToken = localStorage.getItem('authToken');
        if (!authToken || authToken === 'null') {
            toast.error('Your session has expired. Please login again.');
            navigate('/signin');
            return;
        }
        
        // Validation
        if (!formData.agreeToTerms) {
            toast.error('Please agree to the Terms and Conditions');
            return;
        }
        
        try {
            setLoading(true);
            
            console.log('Submitting encash request with data:', formData);
            console.log('Current member data:', memberData);
            console.log('Auth token:', localStorage.getItem('authToken'));
            
            // Submit encash request directly to the API
            const response = await promotionAPI.submitEncashRequest(formData);
            
            console.log('API Response:', response);
            
            if (response.success) {
                setSuccess(true);
                toast.success('Encash request submitted successfully! You will receive confirmation shortly.');
                // Reset form
                setFormData({
                    pointsToEncash: '',
                    facilitationFees: '',
                    amountPayable: '',
                    accountNumber: '',
                    ifscCode: '',
                    branchName: '',
                    personName: '',
                    agreeToTerms: false
                });
                // Switch to My Encash Requests tab if handler provided
                if (typeof setSelectedRedemptionTab === 'function') {
                    setSelectedRedemptionTab('My Encash Requests');
                }
            } else {
                console.error('Encash request failed:', response);
                toast.error(response.message || 'Failed to submit encash request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting encash request:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // More detailed error message
            let errorMessage = 'An error occurred while submitting your request.';
            if (error.message) {
                errorMessage += ` Error: ${error.message}`;
            }
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage += ' Please check your internet connection.';
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Test function to debug API connection
    const testAPIConnection = async () => {
        console.log('Testing API connection...');
        console.log('Base URL:', 'https://piramal-loyalty-dev.lockated.com/');
        console.log('Auth Token:', localStorage.getItem('authToken'));
        console.log('Member Data:', memberData);
        
        try {
            const testPayload = {
                encash_request: {
                    points_to_encash: 1000,
                    facilitation_fee: 20,
                    amount_payable: 980,
                    account_number: "test123",
                    ifsc_code: "TEST0000123",
                    branch_name: "Test Branch",
                    person_name: "Test User",
                    terms_accepted: true
                }
            };
            
            console.log('Test payload:', testPayload);
            
            const response = await fetch('https://piramal-loyalty-dev.lockated.com/encash_requests.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(testPayload)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                toast.success(`Test API call successful! Status: ${response.status}. Check console for details.`);
            } else {
                toast.error(`Test API call failed! Status: ${response.status}. Check console for details.`);
            }
        } catch (error) {
            console.error('Test API error:', error);
            toast.error(`Test API failed: ${error.message}`);
        }
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Checking authentication...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Points Balance Header */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Encash Form</h2>
                <div className="flex items-center space-x-4">
                    {currentPoints > 0 && (
                        <div className="flex items-center space-x-2">
                            <img
                                    src="/redeemStar.png"
                                    alt="star"
                                    className="mr-1"
                                    style={{ width: 24, height: 24, display: 'inline-block' }}
                                  />
                            <span className="text-xl font-bold text-gray-800">
                                {currentPoints.toLocaleString('en-IN')} Point
                            </span>
                        </div>
                    )}
              
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column - Encash Detail */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Encash Detail</h3>
                        <div className="space-y-6">
                            {/* Points to Encash */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    How many points you want to encash ?
                                </label>
                                <input
                                    type="number"
                                    placeholder="Points"
                                    value={formData.pointsToEncash}
                                    onChange={(e) => handleInputChange('pointsToEncash', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    max={currentPoints}
                                    required
                                />
                            </div>

                            {/* Facilitation Fees */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fascilitation Fees 2%
                                </label>
                                <input
                                    type="text"
                                    placeholder="Points"
                                    value={formData.facilitationFees}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                                />
                            </div>

                            {/* Amount Payable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount Payable
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        value={formData.amountPayable}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 bg-gray-50 text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bank Detail */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Bank Detail</h3>
                        <div className="space-y-6">
                            {/* Account Number and IFSC Code */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account No.
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter bank account no."
                                        value={formData.accountNumber}
                                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter IFSC code"
                                        value={formData.ifscCode}
                                        onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Branch Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter branch name"
                                    value={formData.branchName}
                                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>

                            {/* Person Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Person name (As per bank account)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter person name"
                                    value={formData.personName}
                                    onChange={(e) => handleInputChange('personName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                                    required
                                />
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                                    I agree to the{' '}
                                    <span className="text-orange-600 hover:text-orange-700 cursor-pointer underline">
                                        Terms and Conditions
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !formData.agreeToTerms}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                                    loading || !formData.agreeToTerms
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                                }`}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {/* Encash Requests List */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Encash Requests</h3>
                {encashLoading ? (
                    <div className="text-gray-500">Loading encash requests...</div>
                ) : encashRequests.length === 0 ? (
                    <div className="text-gray-500">No encash requests found.</div>
                ) : (
                    <div className="space-y-4">
                        {encashRequests.map((req, idx) => (
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
        </div>
    );
};

export default Encash;
