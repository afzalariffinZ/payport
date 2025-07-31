"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import DataReviewModal from "./data-review-modal";
import SuccessToast from "./success-toast";

interface Change {
  field: string;
  old: any;
  new: any;
}


interface CompanyContactProps {
  onBack: () => void;
}

export default function CompanyContact({ onBack }: CompanyContactProps) {
  const [formData, setFormData] = useState({
    // Contact Information
    companyEmail: "placeholder",
    companyPhone: "+placeholder",
    supportContact: "+placeholder",
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
        const response = await fetch(`/api/merchant/${id}/company-contact`);

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
            companyEmail: apiData.company_email || '',
            companyPhone: apiData.company_phone || '',
            supportContact: apiData.support_contact || ''
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
    console.log("Saving company contact information:", formData);
    // Here you would typically save to your backend
    alert("Company contact information saved successfully!");
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
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Company Contact</h1>
                  <p className="text-sm text-gray-600">Manage your contact information</p>
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
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Phone className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    className="pl-10"
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="tel"
                    value={formData.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    className="pl-10"
                    placeholder="+60 3-xxxx xxxx"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Contact</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="tel"
                    value={formData.supportContact}
                    onChange={(e) => handleInputChange('supportContact', e.target.value)}
                    className="pl-10"
                    placeholder="+60 12-xxx xxxx"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Guidelines */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact Guidelines</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Hours Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Saturday: 10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-2">
                    <strong>For urgent matters outside business hours:</strong>
                  </p>
                  <p className="text-sm text-red-600">
                    Use the support contact number above
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Tips */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Management Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Keep your contact information up to date</li>
                  <li>• Ensure your email can receive important notifications</li>
                  <li>• Use a dedicated business phone number when possible</li>
                </ul>
              </div>
              <div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Support contact should be available during business hours</li>
                  <li>• Consider using a professional email domain</li>
                  <li>• Verify all contact details after making changes</li>
                </ul>
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
          pageTitle="Company Contact"
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