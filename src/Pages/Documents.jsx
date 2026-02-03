import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../salesforce';

const Documents = () => {
    const [files, setFiles] = useState({
        file1: null,
        file2: null,
        file3: null
    });
    const [loading, setLoading] = useState(false);

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:mime/type;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle file selection
    const handleFileChange = (e, fileKey) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid file (PDF, JPG, or PNG)');
            e.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            e.target.value = '';
            return;
        }

        setFiles(prev => ({
            ...prev,
            [fileKey]: file
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that all three files are selected
        if (!files.file1 || !files.file2 || !files.file3) {
            toast.error('Please select all three files before submitting');
            return;
        }

        setLoading(true);

        try {
            // Get FirstPublishLocationId from localStorage (Loyalty Member ID)
            const loyaltyMemberId = localStorage.getItem('loyaltyMemberId');
            
            if (!loyaltyMemberId) {
                toast.error('Loyalty Member ID not found. Please login again.');
                setLoading(false);
                return;
            }

            // Upload all three files
            const uploadPromises = [
                uploadFileToSalesforce(files.file1, 'Document_1', loyaltyMemberId),
                uploadFileToSalesforce(files.file2, 'Document_2', loyaltyMemberId),
                uploadFileToSalesforce(files.file3, 'Document_3', loyaltyMemberId)
            ];

            await Promise.all(uploadPromises);

            toast.success('All documents uploaded successfully!');
            
            // Reset form
            setFiles({
                file1: null,
                file2: null,
                file3: null
            });
            
            // Clear file inputs
            document.getElementById('file1').value = '';
            document.getElementById('file2').value = '';
            document.getElementById('file3').value = '';

        } catch (error) {
            console.error('Error uploading documents:', error);
            toast.error(error.message || 'Failed to upload documents. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Upload single file to Salesforce
    const uploadFileToSalesforce = async (file, title, loyaltyMemberId) => {
        try {
            // Convert file to base64
            const base64Data = await fileToBase64(file);

            // Prepare request payload
            const payload = {
                Title: title,
                PathOnClient: file.name,
                VersionData: base64Data,
                FirstPublishLocationId: loyaltyMemberId
            };

            // Make API call to Salesforce
            const response = await api.post('/services/data/v60.0/sobjects/ContentVersion', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data.success) {
                throw new Error(`Failed to upload ${title}`);
            }

            return response.data;
        } catch (error) {
            console.error(`Error uploading ${title}:`, error);
            throw new Error(`Failed to upload ${title}: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Document Upload
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File 1 */}
                        <div className="space-y-2">
                            <label htmlFor="file1" className="block text-sm font-medium text-gray-700">
                                Document 1 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="file1"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'file1')}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-3 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer border border-gray-300 rounded-md"
                            />
                            {files.file1 && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ {files.file1.name} selected
                                </p>
                            )}
                        </div>

                        {/* File 2 */}
                        <div className="space-y-2">
                            <label htmlFor="file2" className="block text-sm font-medium text-gray-700">
                                Document 2 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="file2"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'file2')}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-3 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer border border-gray-300 rounded-md"
                            />
                            {files.file2 && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ {files.file2.name} selected
                                </p>
                            )}
                        </div>

                        {/* File 3 */}
                        <div className="space-y-2">
                            <label htmlFor="file3" className="block text-sm font-medium text-gray-700">
                                Document 3 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="file3"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'file3')}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-3 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer border border-gray-300 rounded-md"
                            />
                            {files.file3 && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ {files.file3.name} selected
                                </p>
                            )}
                        </div>

                        {/* File Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                File Requirements:
                            </h3>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>Accepted formats: PDF, JPG, PNG</li>
                                <li>Maximum file size: 5MB</li>
                                <li>All three documents are required</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !files.file1 || !files.file2 || !files.file3}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                                ${loading || !files.file1 || !files.file2 || !files.file3
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }
                                transition-colors duration-200`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                'Submit Documents'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Documents;
