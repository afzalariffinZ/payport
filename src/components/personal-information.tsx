"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import DataReviewModal from "./data-review-modal";
import SuccessToast from "./success-toast";

interface Change {
  field: string;
  old: any;
  new: any;
}


interface PersonalInfoProps {
  onBack: () => void;
}

export default function PersonalInformation({ onBack }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    // Owner Information
    ownerName: "Aisyah Binti afzal",
    ownerId: "890123456789",
    dateOfBirth: "1985-06-15",
    nationality: "Malaysian",
    ownerEmail: "aisyah@nasilemakbangsar.com",
    ownerPhone: "+60123456789",
    ownerPosition: "Owner/Manager",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);;

  

  // Smart navigation and document data states
  const { stagedData, clearStagedData, pendingNavigation } = useDocumentData();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for staged data when component mounts or stagedData changes
  useEffect(() => {
    console.log('pendingNavigation.targetPage', pendingNavigation.targetPage);
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
        const response = await fetch(`/api/merchant/${id}/personal-info`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        
        // --- MAPPING LOGIC GOES HERE ---
        if (data && data.personal_info) {
          const apiData = data.personal_info;

          // Create a new object with the correct camelCase keys
          const formattedData = {
            ownerName: apiData.owner_name,
            ownerId: apiData.owner_id,
            dateOfBirth: apiData.dob, // Make sure 'dob' matches your DB column
            nationality: apiData.nationality,
            ownerEmail: apiData.owner_email,
            ownerPhone: apiData.owner_phone,
            // You might not have this field in the DB, so handle it gracefully
            ownerPosition: apiData.owner_position || 'Owner/Manager' 
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

  const handleSave = () => {
    console.log("Saving personal information:", formData);
    // Here you would typically save to your backend
    alert("Personal information saved successfully!");
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
                  <p className="text-sm text-gray-600">Manage your personal details</p>
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
          
          {/* Owner Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Owner Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <Input
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner ID</label>
                <Input
                  value={formData.ownerId}
                  onChange={(e) => handleInputChange('ownerId', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Malaysian">Malaysian</SelectItem>
                    <SelectItem value="Singaporean">Singaporean</SelectItem>
                    <SelectItem value="Indonesian">Indonesian</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Email</label>
                <Input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone</label>
                <Input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Position</label>
                <Input
                  value={formData.ownerPosition}
                  onChange={(e) => handleInputChange('ownerPosition', e.target.value)}
                />
              </div>
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
          pageTitle="Personal Information"
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