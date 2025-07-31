"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for extracted data
export interface ExtractedDataItem {
  new: any;
  old: any;
  field: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  fieldDisplayName: string;
}

export interface DocumentData {
  dataType: string;
  extractedData: Record<string, any>;
  changes: Record<string, ExtractedDataItem>;
  confidence: number;
  timestamp: Date;
}

interface DocumentDataContextType {
  stagedData: DocumentData | null;
  setStagedData: (data: DocumentData | null) => void;
  clearStagedData: () => void;
  pendingNavigation: {
    targetPage: string | null;
    message: string | null;
  };
  setPendingNavigation: (target: string | null, message?: string | null) => void;
}

const DocumentDataContext = createContext<DocumentDataContextType | undefined>(undefined);

export function DocumentDataProvider({ children }: { children: ReactNode }) {
  const [stagedData, setStagedDataState] = useState<DocumentData | null>(null);
  const [pendingNavigation, setPendingNavigationState] = useState<{
    targetPage: string | null;
    message: string | null;
  }>({
    targetPage: null,
    message: null
  });

  const setStagedData = (data: DocumentData | null) => {
    setStagedDataState(data);
  };

  const clearStagedData = () => {
    setStagedDataState(null);
    setPendingNavigationState({ targetPage: null, message: null });
  };

  const setPendingNavigation = (target: string | null, message: string | null = null) => {
    setPendingNavigationState({ targetPage: target, message });
  };

  return (
    <DocumentDataContext.Provider
      value={{
        stagedData,
        setStagedData,
        clearStagedData,
        pendingNavigation,
        setPendingNavigation,
      }}
    >
      {children}
    </DocumentDataContext.Provider>
  );
}

export function useDocumentData() {
  const context = useContext(DocumentDataContext);
  if (context === undefined) {
    throw new Error('useDocumentData must be used within a DocumentDataProvider');
  }
  return context;
}

// Helper function to map data types to page names
export function getPageFromDataType(dataType: string): string {
  const mapping: Record<string, string> = {
    'Business Information': 'business-information',
    'Personal Information': 'personal-information',
    'Bank Information': 'bank-information',
    'Company Contact': 'company-contact',
    'Bank Statement': 'bank-information',
    'Personal ID': 'personal-information',
    'Business Registration': 'business-information',
  };
  
  return mapping[dataType] || 'business-information'; // Default to business info
}

// Helper function to get display name from page key
export function getDisplayNameFromPage(pageKey: string): string {
  const mapping: Record<string, string> = {
    'business-information': 'Business Information',
    'personal-information': 'Personal Information',
    'bank-information': 'Bank Information',
    'company-contact': 'Company Contact',
  };
  
  return mapping[pageKey] || 'Business Information';
}