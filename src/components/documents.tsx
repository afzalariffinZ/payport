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
  AlertCircle
} from "lucide-react";
import { useState, useRef } from "react";

interface Document {
  id: string;
  name: string;
  type: string;
  url?: string;
  size?: string;
  uploadDate?: string;
  status: 'uploaded' | 'missing' | 'pending';
}

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

export default function Documents({ onBack }: DocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Document categories with initial mock data
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>([
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Official business registration license',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      document: {
        id: '1',
        name: 'business-license.pdf',
        type: 'PDF',
        url: '/documents/business-license.pdf',
        size: '2.4 MB',
        uploadDate: '2024-01-15',
        status: 'uploaded'
      }
    },
    {
      id: 'halal-certificate',
      name: 'Halal Certificate',
      description: 'Halal certification for food business',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      document: {
        id: '2',
        name: 'halal-cert.jpg',
        type: 'JPG',
        url: '/documents/halal-cert.jpg',
        size: '1.8 MB',
        uploadDate: '2024-01-12',
        status: 'uploaded'
      }
    },
    {
      id: 'ic-passport',
      name: 'IC/Passport',
      description: 'Owner identification document',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      document: undefined
    },
    {
      id: 'menu-photos',
      name: 'Menu Photos',
      description: 'High-quality photos of your menu',
      required: false,
      acceptedFormats: ['JPG', 'PNG', 'HEIC'],
      document: {
        id: '3',
        name: 'menu-collection.jpg',
        type: 'JPG',
        url: '/documents/menu-photos.jpg',
        size: '3.2 MB',
        uploadDate: '2024-01-10',
        status: 'uploaded'
      }
    },
    {
      id: 'outlet-photos',
      name: 'Outlet Photos',
      description: 'Photos showing your restaurant interior and exterior',
      required: false,
      acceptedFormats: ['JPG', 'PNG', 'HEIC'],
      document: undefined
    },
    {
      id: 'signed-agreement',
      name: 'Signed Agreement',
      description: 'Merchant agreement with PayPort Real',
      required: true,
      acceptedFormats: ['PDF'],
      document: undefined
    },
    {
      id: 'ssm-certificate',
      name: 'SSM Certificate',
      description: 'Companies Commission of Malaysia registration',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      document: {
        id: '4',
        name: 'ssm-certificate.pdf',
        type: 'PDF',
        url: '/documents/ssm-cert.pdf',
        size: '1.1 MB',
        uploadDate: '2024-01-08',
        status: 'uploaded'
      }
    },
    {
      id: 'bank-statement',
      name: 'Bank Statement',
      description: 'Latest bank statement for account verification',
      required: true,
      acceptedFormats: ['PDF'],
      document: undefined
    }
  ]);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleUploadClick = (categoryId: string) => {
    setUploadingFor(categoryId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingFor) return;

    // Simulate file upload (in real app, you'd upload to server)
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'Unknown',
      url: URL.createObjectURL(file), // In real app, this would be server URL
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'uploaded'
    };

    // Update the document category
    setDocumentCategories(prev => 
      prev.map(cat => 
        cat.id === uploadingFor 
          ? { ...cat, document: newDocument }
          : cat
      )
    );

    setUploadingFor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocumentCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, document: undefined }
            : cat
        )
      );
    }
  };

  const handleDownloadDocument = (document: Document) => {
    // In real app, this would trigger actual download
    
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'missing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const completedDocuments = documentCategories.filter(cat => cat.document?.status === 'uploaded').length;
  const totalDocuments = documentCategories.length;
  const requiredDocuments = documentCategories.filter(cat => cat.required).length;
  const completedRequired = documentCategories.filter(cat => cat.required && cat.document?.status === 'uploaded').length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Overview */}
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

          {/* Documents Grid */}
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
                    {/* Document Info */}
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

                    {/* Action Buttons */}
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

                    {/* Replace Button */}
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
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors duration-200">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">No document uploaded</p>
                      <p className="text-xs text-gray-500">
                        Click below to upload {category.acceptedFormats.join(', ')} file
                      </p>
                    </div>

                    {/* Upload Button */}
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

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          className="hidden"
        />
      </div>

      {/* Document Viewer Modal */}
      {isViewerOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedDocument.type} • {selectedDocument.size} • {selectedDocument.uploadDate}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 p-6 overflow-auto">
              {['JPG', 'PNG', 'JPEG', 'HEIC'].includes(selectedDocument.type.toUpperCase()) ? (
                <div className="flex justify-center">
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : selectedDocument.type.toUpperCase() === 'PDF' ? (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">PDF Preview</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Click download to view the full PDF document
                    </p>
                    <Button
                      onClick={() => handleDownloadDocument(selectedDocument)}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Cannot preview this file type</p>
                  <p className="text-sm text-gray-500 mt-2">Download to view the document</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 