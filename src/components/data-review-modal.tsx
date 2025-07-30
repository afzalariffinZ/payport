"use client";

import { Button } from "@/components/ui/button";
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Bot
} from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentData } from "@/lib/document-data-store";

interface DataReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  documentData: DocumentData;
  pageTitle: string;
  currentData: Record<string, any>;
}

export default function DataReviewModal({
  isOpen,
  onClose,
  onProceed,
  documentData,
  pageTitle,
  currentData
}: DataReviewModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleProceed = () => {
    onProceed();
    handleClose();
  };

  if (!isOpen) return null;

  const { dataType, extractedData, changes, confidence, timestamp } = documentData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#ff0080] to-[#e00074] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Review Extracted Data</h2>
              <p className="text-pink-100 text-sm">
                AI found {dataType.toLowerCase()} data for {pageTitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">


                      {/* Changes Comparison - Minimalist Design */}
          <div className="p-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Review Changes
              </h3>
              <p className="text-gray-600">
                {Object.keys(changes).length} field{Object.keys(changes).length !== 1 ? 's' : ''} will be updated
              </p>
            </div>

            {Object.keys(changes).length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">No changes detected - all extracted data matches current values.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(changes).map(([fieldKey, change]: [string, any]) => (
                  <div key={fieldKey} className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">{change.field}</h4>
                    
                    <div className="flex items-center justify-between">
                      {/* Current Value */}
                      <div className="flex-1 text-center">
                        <div className="text-sm font-medium text-gray-500 mb-2">Current</div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                          <span className="text-gray-900 font-medium">
                            {change.old || <em className="text-gray-400">Empty</em>}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex-shrink-0 mx-8">
                        <div className="w-12 h-12 bg-[#ff0080] rounded-full flex items-center justify-center">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* New Value */}
                      <div className="flex-1 text-center">
                        <div className="text-sm font-medium text-gray-500 mb-2">New</div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                          <span className="text-gray-900 font-medium">
                            {change.new}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleProceed}
              className="w-full bg-[#ff0080] hover:bg-[#e00074] text-white text-lg py-4 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={Object.keys(changes).length === 0}
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-3" />
              Apply Changes
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
              className="w-full text-lg py-4 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}