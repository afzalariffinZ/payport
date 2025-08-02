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
import { Checkbox } from "@/components/ui/checkbox";

interface Change {
  field: string;
  old: any;
  new: any;
}

interface DataReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (selectedChanges: Record<string, Change>) => void;
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
}: DataReviewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<Record<string, boolean>>({});

  const { dataType, changes } = documentData;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // By default, all changes are selected
      const initialSelection = Object.keys(changes).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedChanges(initialSelection);
    }
  }, [isOpen, changes]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match animation duration
  };


  const handleProceed = () => {
    const changesToApply = Object.entries(changes)
      .filter(([key]) => selectedChanges[key])
      .reduce((acc, [key, value]) => {
        acc[key] = {
          field: value.field,
          old: value.old,
          new: value.new,
        };
        return acc;
      }, {} as Record<string, Change>);

    onProceed(changesToApply);
    handleClose();
  };

  const handleToggleChange = (fieldKey: string) => {
    setSelectedChanges(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const numSelectedChanges = Object.values(selectedChanges).filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'opacity-60' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] transition-all duration-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white sticky top-0 rounded-t-2xl z-10">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-[#ff0080] to-[#e00074] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Review Extracted Data</h2>
              <p className="text-gray-500 text-sm">
                AI found new information for {pageTitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow p-6">
          <div className="text-left mb-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">
              Review Changes
            </h3>
            <p className="text-gray-600">
              Review the changes below and deselect any you want to ignore.
            </p>
          </div>

          {Object.keys(changes).length === 0 ? (
            <div className="text-center py-10 px-6 bg-white rounded-xl border border-gray-200">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-700 font-medium text-lg">No changes detected.</p>
              <p className="text-gray-500">All extracted data matches the current information.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(changes).map(([fieldKey, change]: [string, any]) => (
                <div
                  key={fieldKey}
                  className={`bg-white rounded-xl border transition-all duration-300 ${selectedChanges[fieldKey] ? 'border-pink-300 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  onClick={() => handleToggleChange(fieldKey)}
                >
                  <div className="p-5 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-800">{change.field}</h4>
                      <Checkbox
                        checked={selectedChanges[fieldKey]}
                        onCheckedChange={() => handleToggleChange(fieldKey)}
                        className="h-5 w-5 rounded"
                        aria-label={`Select change for ${change.field}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 text-center">
                      {/* Current Value */}
                      <div className="w-full">
                        <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Current</div>
                        <div className="bg-gray-100 rounded-lg p-3 min-h-[50px] flex items-center justify-center">
                          <span className="text-gray-800 font-medium text-sm break-all">
                            {change.old || <em className="text-gray-400 italic">Not set</em>}
                          </span>
                        </div>
                      </div>

                      {/* Arrow Separator */}
                      <div className="w-full md:hidden flex items-center justify-center my-2">
                        <ArrowRight className="w-5 h-5 text-gray-300 transform rotate-90" />
                      </div>

                      {/* New Value */}
                      <div className="w-full">
                        <div className="text-xs font-semibold text-pink-600 mb-1 uppercase tracking-wider">New</div>
                        <div className={`bg-pink-50 border-pink-200 border rounded-lg p-3 min-h-[50px] flex items-center justify-center`}>
                          <span className="text-pink-800 font-bold text-sm break-all">
                            {change.new}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-white/80 backdrop-blur-sm sticky bottom-0 rounded-b-2xl z-10">
          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <Button
              onClick={handleProceed}
              className="w-full sm:w-auto bg-[#ff0080] hover:bg-[#e00074] text-white text-base py-3 px-5 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={numSelectedChanges === 0}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Apply {numSelectedChanges > 0 ? `${numSelectedChanges} Change${numSelectedChanges > 1 ? 's' : ''}` : 'Changes'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full sm:w-auto text-base py-3 px-5 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}