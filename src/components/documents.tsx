"use client";

import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Upload, 
  Eye, 
  Trash2, 
  FileText, 
  Image as ImageIcon,
  Download,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Define the shape of a single document
interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
  uploadDate: string;
  status: 'uploaded';
}

// Define the shape of a document category
interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  document?: Document;
}

interface DocumentsProps {
  onBack: () => void;
}

// This is the "blueprint" for your page.
const DOCUMENT_CATEGORIES_TEMPLATE: DocumentCategory[] = [
  { id: 'business_license', name: 'Business License', description: 'Official business registration license', required: true, acceptedFormats: ['PDF', 'JPG', 'PNG'] },
  { id: 'halal_cert', name: 'Halal Certificate', description: 'Halal certification for food business', required: true, acceptedFormats: ['PDF', 'JPG', 'PNG'] },
  { id: 'ic_passport', name: 'IC/Passport', description: 'Owner identification document', required: true, acceptedFormats: ['PDF', 'JPG', 'PNG'] },
  { id: 'menu_photos', name: 'Menu Photos', description: 'High-quality photos of your menu', required: false, acceptedFormats: ['JPG', 'PNG', 'HEIC'] },
  { id: 'outlet_photos', name: 'Outlet Photos', description: 'Photos showing your restaurant interior and exterior', required: false, acceptedFormats: ['JPG', 'PNG', 'HEIC'] },
  { id: 'signed_agreement', name: 'Signed Agreement', description: 'Merchant agreement with PayPort Real', required: true, acceptedFormats: ['PDF'] },
  { id: 'ssm_cert', name: 'SSM Certificate', description: 'Companies Commission of Malaysia registration', required: true, acceptedFormats: ['PDF', 'JPG', 'PNG'] },
  { id: 'bank_statement', name: 'Bank Statement', description: 'Latest bank statement for account verification', required: true, acceptedFormats: ['PDF'] }
];

export default function Documents({ onBack }: DocumentsProps) {
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(DOCUMENT_CATEGORIES_TEMPLATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_USER_ID || "MRT-56789";

    async function fetchDocuments() {
      try {
        const response = await fetch(`/api/merchant/${id}/documents`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch documents from the server.");
        }
        const data = await response.json();

        if (data && data.documents) {
          const apiUrls = data.documents;
          const updatedCategories = DOCUMENT_CATEGORIES_TEMPLATE.map(category => {
            const url = apiUrls[category.id];
            if (url) {
              const fullFilename = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1).split('?')[0]);
              const underscoreIndex = fullFilename.indexOf('_');
              
              // THE FIX: Create a clean display name
              const displayName = underscoreIndex !== -1 
                ? fullFilename.substring(underscoreIndex + 1) 
                : fullFilename;

              return {
                ...category,
                document: {
                  id: category.id,
                  name: displayName, // Use the clean name
                  type: url.substring(url.lastIndexOf('.') + 1).split('?')[0].toUpperCase(),
                  url: url,
                  size: 'N/A',
                  uploadDate: 'N/A',
                  status: 'uploaded' as const
                }
              };
            }
            return { ...category, document: undefined };
          });
          setDocumentCategories(updatedCategories);
        } else {
          throw new Error("API response did not contain the expected 'documents' object.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const handleViewDocument = (document: Document) => {
    if (document.url) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.url) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUploadClick = (categoryId: string) => {
    setUploadingFor(categoryId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingFor) return;

    console.log(`Simulating upload of ${file.name} for category: ${uploadingFor}`);
    const newDocument: Document = {
      id: uploadingFor,
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'uploaded'
    };

    setDocumentCategories(prev => 
      prev.map(cat => 
        cat.id === uploadingFor ? { ...cat, document: newDocument } : cat
      )
    );
    setUploadingFor(null);
  };

  const handleDeleteDocument = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocumentCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, document: undefined } : cat
        )
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (type: string) => {
    if (['JPG', 'PNG', 'HEIC', 'JPEG'].includes(type.toUpperCase())) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-red-500" />;
  };

  const completedDocuments = documentCategories.filter(cat => cat.document).length;
  const totalDocuments = documentCategories.length;
  const requiredDocuments = documentCategories.filter(cat => cat.required).length;
  const completedRequired = documentCategories.filter(cat => cat.required && cat.document).length;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50 p-8">
        <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400"/>
            <h3 className="mt-4 text-lg font-medium text-red-800">Failed to Load Documents</h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-6 bg-red-600 hover:bg-red-700">Try Again</Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Documents</h1>
                    <p className="text-sm text-gray-600">Manage your business documents</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {completedDocuments}/{totalDocuments} Uploaded
                  </p>
                  <p className="text-xs text-gray-600">
                    {completedRequired}/{requiredDocuments} Required Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Document Completion</h2>
              <span className="text-sm text-gray-600">
                {Math.round((completedDocuments / totalDocuments) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedDocuments / totalDocuments) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Required: {completedRequired}/{requiredDocuments}</span>
              <span>Optional: {completedDocuments - completedRequired}/{totalDocuments - requiredDocuments}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-200">{category.description}</p>
                    <p className="text-xs text-gray-500">
                      Accepts: {category.acceptedFormats.join(', ')}
                    </p>
                  </div>
                  {category.document ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>

                {category.document ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getDocumentIcon(category.document.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {category.document.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {category.document.size} • {category.document.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleViewDocument(category.document!)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDownloadDocument(category.document!)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDeleteDocument(category.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleUploadClick(category.id)}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors duration-200">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">No document uploaded</p>
                      <p className="text-xs text-gray-500">
                        Click below to upload {category.acceptedFormats.join(', ')} file
                      </p>
                    </div>
                    <Button
                      onClick={() => handleUploadClick(category.id)}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Upload {category.name}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          className="hidden"
        />
      </div>

      {isViewerOpen && selectedDocument && (
        // This modal is no longer used for viewing, but can be kept for other purposes or removed.
        // For now, I'm removing it to simplify the code since handleViewDocument now opens a new tab.
        <></>
      )}
    </>
  );
}