"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  Store,
  Clock,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import DataReviewModal from "./data-review-modal";
import SuccessToast from "./success-toast";

interface Change {
  field: string;
  old: any;
  new: any;
}

interface BusinessInfoProps {
  onBack: () => void;
}

interface ExtractedData {
  businessName?: string;
  outletName?: string;
  outletAddress?: string;
  ssmNumber?: string;
  merchantId?: string;
  // Add more fields as needed
}

export default function BusinessInformation({ onBack }: BusinessInfoProps) {
  const [formData, setFormData] = useState({
    // Business Details
    businessId: "BIZ001",
    businessName: "Nasi Lemak Bangsar",
    outletName: "Bangsar Branch",
    outletAddress: "18 Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
    outletType: "Restaurant",
    cuisineCategory: "Malaysian Cuisine",
    ssmNumber: "202301234567",
    merchantId: "MRT-56789",

    // Operating Hours
    openingTime: "08:00",
    closingTime: "22:00",
    deliveryRadius: "5",
    serviceTypes: "Dine-in, Takeaway, Delivery",

    // System Information
    profileCreatedAt: "2024-01-15"
  });

  // Upload related states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smart navigation and document data states
  const { stagedData, clearStagedData, pendingNavigation } = useDocumentData();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Correctly reference the public environment variable
    const id = process.env.NEXT_PUBLIC_USER_ID;

    // This check is now very important. It tells you if your .env.local file is set up correctly.
    if (!id) {
      setError("Merchant ID is not configured in environment variables. Check your .env.local file for NEXT_PUBLIC_MERCHANT_ID.");
      setIsLoading(false);
      return;
    }

    async function fetchInfo() {
      try {
        const response = await fetch(`/api/merchant/${id}/business-info`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // --- MAPPING LOGIC GOES HERE ---
        if (data && data.business_info) {
          const apiData = data.business_info;

          // Create a new object with the correct camelCase keys
          const formattedData = {
            businessId: '',
            businessName: apiData.business_name || '',
            supportContact: '',
            outletName: apiData.outlet_name || '',
            outletAddress: apiData.outlet_address || '',
            outletType: apiData.outlet_type,
            cuisineCategory: apiData.outlet_category,
            ssmNumber: apiData.ssm_number,
            merchantId: apiData.merchant_id,

            // Operating Hours
            openingTime: apiData.open_time ? apiData.open_time.substring(0, 5) : '', // Format HH:mm:ss to HH:mm
            closingTime: apiData.close_time ? apiData.close_time.substring(0, 5) : '', // Format HH:mm:ss to HH:mm
            deliveryRadius: apiData.delivery_radius ? apiData.delivery_radius.replace('km', '') : '', // Remove 'km'
            serviceTypes: apiData.service_type || '',

            // System Information
            profileCreatedAt: apiData.created_at ? apiData.created_at.substring(0, 10) : ''
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
    console.log("Saving business information:", formData);
    // Here you would typically save to your backend
    alert("Business information saved successfully!");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload only images (JPG, PNG) or PDF files.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    setUploadError(null);
    setIsProcessing(true);

    try {
      // Read file content for AI processing
      const fileContent = await readFileContent(file);

      // Use AI to extract business information
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Analyze this business document and extract relevant business information that can be used to update a merchant profile.",
          documentContent: fileContent,
          currentData: formData,
          analysisType: 'document-smart-analysis'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process document with AI');
      }

      const data = await response.json();

      if (data.isValidJson && data.parsed && data.parsed.extractedData) {
        const { extractedData: aiExtractedData } = data.parsed;

        // Filter extracted data to only include fields that exist in our form
        const relevantData: ExtractedData = {};
        Object.keys(formData).forEach(key => {
          if (aiExtractedData[key]) {
            (relevantData as any)[key] = aiExtractedData[key];
          }
        });

        if (Object.keys(relevantData).length > 0) {
          setExtractedData(relevantData);
          setShowExtractedData(true);
        } else {
          setUploadError('No relevant business information found in the document. Please try uploading a business registration document, license, or similar business document.');
        }
      } else {
        setUploadError('AI could not extract clear business information from this document. Please ensure the document contains visible text with business details.');
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError('Failed to process the document with AI. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          // For AI processing, we'll send the base64 data with file type info
          const base64Data = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
          const fileType = file.type;
          const fileName = file.name;

          // Create a structured content for AI processing
          const aiContent = `File: ${fileName} (${fileType})
Base64 Data: ${base64Data}

Please analyze this ${file.type.includes('image') ? 'image' : 'PDF document'} and extract any business information such as:
- Business name
- Business registration number (SSM)
- Business address
- Owner name
- Contact information
- Business type or category
- Any other relevant business details

SPECIAL INSTRUCTIONS FOR SSM DOCUMENTS:
If this is an SSM (Suruhanjaya Syarikat Malaysia) certificate, please map:
- "Name of the business" → businessName
- "Registration No" → ssmNumber  
- "Principal place of business" → outletAddress
- "Business ownership" → outletName

Focus on extracting accurate information that can be used to update a merchant profile.`;

          resolve(aiContent);
        } else {
          reject(new Error('Failed to read file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      // Always read as data URL for images and PDFs
      reader.readAsDataURL(file);
    });
  };

  const handleApplyExtractedData = () => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));
      setShowExtractedData(false);
      setExtractedData(null);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDiscardExtractedData = () => {
    setShowExtractedData(false);
    setExtractedData(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setShowExtractedData(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Business Information</h1>
                  <p className="text-sm text-gray-600">Manage your business details</p>
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

          {/* Upload Data Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-pink-500 mr-3" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">AI-Powered Document Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">Upload business documents and let AI automatically extract relevant information</p>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors duration-200">
              {!uploadedFile ? (
                <div>
                  <div className="mx-auto w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Business Document</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload business registration documents, SSM certificates, business licenses, business cards, or any document with business information. Our AI will automatically extract relevant details.
                  </p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Images (JPG, PNG)
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-1" />
                      PDF Documents
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    {uploadedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-8 h-8 text-pink-500" />
                    ) : (
                      <FileText className="w-8 h-8 text-pink-500" />
                    )}
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isProcessing && (
                      <div className="flex items-center text-pink-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI analyzing document...
                      </div>
                    )}
                    <button
                      onClick={removeUploadedFile}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload/Analysis Error */}
            {uploadError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">AI Analysis Error</p>
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Extracted Data Preview */}
            {showExtractedData && extractedData && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-medium text-green-800">AI Analysis Complete</h3>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {Object.entries(extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-green-200 last:border-b-0">
                      <span className="text-sm font-medium text-green-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="text-sm text-green-700">{value as string}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleApplyExtractedData}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply to Form
                  </Button>
                  <Button
                    onClick={handleDiscardExtractedData}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Discard
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Basic Business Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Store className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Business Details</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business ID</label>
                <Input
                  value={formData.businessId}
                  onChange={(e) => handleInputChange('businessId', e.target.value)}
                  placeholder="Enter business ID"
                />
              </div> */}



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outlet Name</label>
                <Input
                  value={formData.outletName}
                  onChange={(e) => handleInputChange('outletName', e.target.value)}
                  placeholder="Enter outlet name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SSM Number</label>
                <Input
                  value={formData.ssmNumber}
                  onChange={(e) => handleInputChange('ssmNumber', e.target.value)}
                  placeholder="Enter SSM number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
                <Input
                  value={formData.merchantId}
                  onChange={(e) => handleInputChange('merchantId', e.target.value)}
                  placeholder="Enter merchant ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outlet Type</label>
                <Select value={formData.outletType} onValueChange={(value) => handleInputChange('outletType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outlet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                    <SelectItem value="Food Truck">Food Truck</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Outlet Address</label>
                <Textarea
                  value={formData.outletAddress}
                  onChange={(e) => handleInputChange('outletAddress', e.target.value)}
                  rows={3}
                  placeholder="Enter complete outlet address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Category</label>
                <Select value={formData.cuisineCategory} onValueChange={(value) => handleInputChange('cuisineCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outlet category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Malaysian Cuisine">Malaysian Cuisine</SelectItem>
                    <SelectItem value="Chinese Cuisine">Chinese Cuisine</SelectItem>
                    <SelectItem value="Indian Cuisine">Indian Cuisine</SelectItem>
                    <SelectItem value="Western Cuisine">Western Cuisine</SelectItem>
                    <SelectItem value="Japanese Cuisine">Japanese Cuisine</SelectItem>
                    <SelectItem value="Thai Cuisine">Thai Cuisine</SelectItem>
                    <SelectItem value="Korean Cuisine">Korean Cuisine</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Created At</label>
                <Input
                  type="date"
                  value={formData.profileCreatedAt}
                  readOnly // This makes the input non-editable
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-pink-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Operating Hours & Services</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                <Input
                  type="time"
                  value={formData.openingTime}
                  onChange={(e) => handleInputChange('openingTime', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                <Input
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => handleInputChange('closingTime', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
                <Input
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
                  placeholder="Enter delivery radius"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Types</label>
                <Input
                  value={formData.serviceTypes}
                  onChange={(e) => handleInputChange('serviceTypes', e.target.value)}
                  placeholder="e.g., Dine-in, Takeaway, Delivery"
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
          pageTitle="Business Information"
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