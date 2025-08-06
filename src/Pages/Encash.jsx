import React, { useState } from 'react';
import promotionAPI from '../services/promotionAPI';

const Encash = ({ memberData }) => {
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
        if (!formData.agreeToTerms) {
            alert('Please agree to the Terms and Conditions');
            return;
        }
        
        try {
            setLoading(true);
            
            // Validate bank details first
            const validationResponse = await promotionAPI.validateBankDetails({
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode
            });
            
            if (!validationResponse.success) {
                alert('Invalid bank details. Please check and try again.');
                return;
            }
            
            // Submit encash request
            const response = await promotionAPI.submitEncashRequest(formData);
            
            if (response.success) {
                setSuccess(true);
                alert('Encash request submitted successfully!');
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
            } else {
                alert('Failed to submit encash request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting encash request:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Points Balance Header */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Encash Form</h2>
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
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                    max={currentPoints}
                                    
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
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                        
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
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                        
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
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                    
                                />
                            </div>

                            {/* Person Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Person name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter person name"
                                    value={formData.personName}
                                    onChange={(e) => handleInputChange('personName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                    
                                />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                    className="w-4 h-4 text-gray-400 border-gray-300 rounded mt-1"
                                    
                                />
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-500">
                                    I agree to the{' '}
                                    <span className="text-gray-400">
                                        Terms and Conditions
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                
                                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 bg-gray-400 text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Encash;
