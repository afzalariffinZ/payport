"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ms';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Dashboard
    'dashboard.title': 'Merchant Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.quickActions': 'Quick Actions',
    
    // Navigation
    'nav.personalInfo': 'Personal Information',
    'nav.businessInfo': 'Business Information',
    'nav.companyContact': 'Company Contact',
    'nav.bankInfo': 'Bank Information',
    'nav.foodMenu': 'Food Menu',
    'nav.documents': 'Documents',
    'nav.loanInvestment': 'Loan & Investment',
    'nav.transactionAnalysis': 'Transaction Analysis',
    'nav.connectedApps': 'Connected Apps',
    
    // Actions
    'action.edit': 'Edit',
    'action.view': 'View',
    'action.update': 'Update',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    
    // Status
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.inProgress': 'In Progress',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.displayQR': 'Display QR Code',
    'common.profileStatus': 'Profile Status',
    'common.complete': 'Complete', 
    'common.lastUpdated': 'Last Updated',
    'common.manageProfile': 'Manage your merchant profile with ease',
  },
  ms: {
    // Dashboard
    'dashboard.title': 'Papan Pemuka Pedagang',
    'dashboard.welcome': 'Selamat kembali',
    'dashboard.overview': 'Gambaran Keseluruhan',
    'dashboard.quickActions': 'Tindakan Pantas',
    
    // Navigation
    'nav.personalInfo': 'Maklumat Peribadi',
    'nav.businessInfo': 'Maklumat Perniagaan',
    'nav.companyContact': 'Hubungan Syarikat',
    'nav.bankInfo': 'Maklumat Bank',
    'nav.foodMenu': 'Menu Makanan',
    'nav.documents': 'Dokumen',
    'nav.loanInvestment': 'Pinjaman & Pelaburan',
    'nav.transactionAnalysis': 'Analisis Transaksi',
    'nav.connectedApps': 'Aplikasi Bersambung',
    
    // Actions
    'action.edit': 'Sunting',
    'action.view': 'Lihat',
    'action.update': 'Kemas Kini',
    'action.save': 'Simpan',
    'action.cancel': 'Batal',
    
    // Status
    'status.completed': 'Selesai',
    'status.pending': 'Menunggu',
    'status.inProgress': 'Dalam Proses',
    
    // Common
    'common.loading': 'Memuatkan...',
    'common.error': 'Ralat',
    'common.success': 'Berjaya',
    'common.close': 'Tutup',
    'common.displayQR': 'Paparkan Kod QR',
    'common.profileStatus': 'Status Profil',
    'common.complete': 'Lengkap',
    'common.lastUpdated': 'Kemas Kini Terakhir',
    'common.manageProfile': 'Urus profil pedagang anda dengan mudah',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('payport-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ms')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('payport-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
