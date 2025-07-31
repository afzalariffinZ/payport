"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import DataReviewModal from "./data-review-modal";
import SuccessToast from "./success-toast";

interface Change {
  field: string;
  old: any;
  new: any;
}


interface BankInfoProps {
  onBack: () => void;
}

export default function BankInformation({ onBack }: BankInfoProps) {
  const [formData, setFormData] = useState({
    // Banking Information
    bankName: "Maybank",
    bankAccountNumber: "1234567890123456",
    accountHolderName: "Aisyah Binti Ramli",
    accountType: "Business Account",
  });

  // Smart navigation and document data states
  const { stagedData, clearStagedData, pendingNavigation } = useDocumentData();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Correctly reference the public environment variable
    const id = process.env.NEXT_PUBLIC_USER_ID;
    
    // This check is now very important. It tells you if your .env.local file is set up correctly.
    if (!id) {
        setError("Merchant ID is not configured in environment variables. Check your .env.local file for NEXT_PUBLIC_USER_ID.");
        setIsLoading(false);
        return;
    }
  
    async function fetchInfo() {
      try {
        const response = await fetch(`/api/merchant/${id}/bank-info`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        
        // --- MAPPING LOGIC GOES HERE ---
        if (data && data.company_contact) {
          const apiData = data.company_contact;

          // Create a new object with the correct camelCase keys
          const formattedData = {
            bankName: apiData.bank_name || '', 
            bankAccountNumber: apiData.bank_account || '',
            accountHolderName: apiData.account_holder || '',
            accountType: apiData.account_type || '',
          };

          setFormData(formattedData);
        }
        // --- END OF MAPPING LOGIC ---
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInfo();
  }, []);

  // Check for staged data when component mounts or stagedData changes
  useEffect(() => {
    if (stagedData) {
      setShowReviewModal(true);
    }
  }, [stagedData, pendingNavigation.targetPage]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving bank information:", formData);
    // Here you would typically save to your backend
    alert("Bank information saved successfully!");
  };

  // Smart navigation handlers
const handleReviewModalProceed = (selectedChanges: Record<string, Change>) => {
    if (!stagedData) return;

    // Apply ONLY the selected changes to the form data
    const updatedFormData = { ...formData };

    // --- THIS IS THE KEY CHANGE ---
    // We now iterate over the 'selectedChanges' object passed from the modal,
    // NOT the original 'stagedData.extractedData'.
    Object.entries(selectedChanges).forEach(([key, change]) => {
      // The 'key' is the field name (e.g., 'businessName')
      // The 'change' object contains the new value at 'change.new'
      if (key in updatedFormData) {
        (updatedFormData as any)[key] = change.new;
      }
    });

    setFormData(updatedFormData);

    // Clear staged data and close modal
    clearStagedData();
    setShowReviewModal(false);

    // --- UPDATE THE SUCCESS MESSAGE ---
    // The success message should also reflect the number of APPLIED changes.
    const numAppliedChanges = Object.keys(selectedChanges).length;
    setSuccessMessage(`Successfully applied ${numAppliedChanges} change${numAppliedChanges !== 1 ? 's' : ''} from the AI-analyzed document!`);
    setShowSuccessToast(true);
  };

  // This function can remain the same
  const handleReviewModalCancel = () => {
    clearStagedData();
    setShowReviewModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bank Information</h1>
                  <p className="text-sm text-gray-600">Manage your banking details</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Banking Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Banking Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <Select value={formData.bankName} onValueChange={(value) => handleInputChange('bankName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maybank">Maybank</SelectItem>
                    <SelectItem value="CIMB Bank">CIMB Bank</SelectItem>
                    <SelectItem value="Public Bank">Public Bank</SelectItem>
                    <SelectItem value="RHB Bank">RHB Bank</SelectItem>
                    <SelectItem value="Hong Leong Bank">Hong Leong Bank</SelectItem>
                    <SelectItem value="AmBank">AmBank</SelectItem>
                    <SelectItem value="OCBC Bank">OCBC Bank</SelectItem>
                    <SelectItem value="UOB Bank">UOB Bank</SelectItem>
                    <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
                    <SelectItem value="HSBC Bank">HSBC Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business Account">Business Account</SelectItem>
                    <SelectItem value="Current Account">Current Account</SelectItem>
                    <SelectItem value="Savings Account">Savings Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                <Input
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <Input
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                />
              </div>
            </div>

            {/* Additional Banking Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Banking Notes</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Ensure your account holder name matches exactly with your official documents</li>
                <li>• Business accounts are recommended for merchant transactions</li>
                <li>• Account verification may take 1-2 business days</li>
                <li>• All banking information is encrypted and secure</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Data Review Modal for AI Navigation */}
      {showReviewModal && stagedData && (
        <DataReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewModalCancel}
          onProceed={handleReviewModalProceed}
          documentData={stagedData}
          pageTitle="Bank Information"
          currentData={formData}
        />
      )}

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
} 