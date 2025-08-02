"use client";

import { Button } from "@/components/ui/button";
import {
  Building2,
  User,
  Phone,
  Landmark,
  FileText,
  UtensilsCrossed,
  Edit3,
  QrCode,
  Store,
  DollarSign,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import { useLanguage } from "@/lib/language-context";
import QRCodeModal from "./qr-code-modal";
import LanguageToggle from "./language-toggle";
import Link from "next/link";


interface MenuItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  route: string;
}

export default function MerchantDashboard() {
  const [showQRModal, setShowQRModal] = useState(false);
  const { t } = useLanguage();

  const menuItems: MenuItem[] = [
    {
      icon: Building2,
      label: t('nav.businessInfo'),
      route: "/business-information",
    },
    {
      icon: User,
      label: t('nav.personalInfo'),
      route: "/personal-information",
    },
    {
      icon: Phone,
      label: t('nav.companyContact'),
      route: "/company-contact",
    },
    {
      icon: Landmark,
      label: t('nav.bankInfo'),
      route: "/bank-information",
    },
    {
      icon: FileText,
      label: t('nav.documents'),
      route: "/documents",
    },
    {
      icon: UtensilsCrossed,
      label: t('nav.foodMenu'),
      route: "/food-menu",
    },
    {
      icon: DollarSign,
      label: t('nav.loanInvestment'),
      route: "/loan-investment-incentive",
    },
    {
      icon: BarChart3,
      label: t('nav.transactionAnalysis'),
      route: "/transaction-analysis",
    },
    {
      icon: Smartphone,
      label: t('nav.connectedApps'),
      route: "/connected-apps",
    },
  ];

  const handleQRCodeClick = () => {
    console.log("Display QR Code clicked");
    setShowQRModal(true);
  };

  const handleEditClick = () => {
    console.log("Edit profile clicked");
    // Here you can add edit profile logic
  };

  return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header/Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between fade-in-up" style={{animationDelay:'100ms'}}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                      <p className="text-sm text-gray-600">PayPort Real</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LanguageToggle />
                    <button
                      onClick={handleEditClick}
                      className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t('action.edit')} Profile
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Welcome Section */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="text-center">
                      {/* Store Logo */}
                      <div className="mb-6">

                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow">
                            <Store className="w-8 h-8 text-white" />
                          </div>
                          <h1 className="mt-2 text-lg font-bold text-pink-600 leading-tight">Nasi Lemak Bangsar</h1>
                          <span className="text-xs text-gray-500">Authentic Malaysian Cuisine</span>
                          <div className="mt-1 text-center">
                            <span className="block text-base font-semibold text-gray-900">{t('dashboard.welcome')}, <span className="font-medium text-gray-800">Aisyah Binti Ramli</span></span>
                            <span className="text-xs text-gray-600">{t('common.manageProfile')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.quickActions')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <div key={index} className="fade-in-up" style={{animationDelay:`${150+index*70}ms`}}>
                            <Link
                              href={item.route}
                              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-pink-100 rounded-xl transition-all duration-300 min-h-[140px] border border-gray-200 hover:border-pink-300 hover:scale-105"
                              aria-label={`Navigate to ${item.label}`}
                            >
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 transition-all duration-300">
                                <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-pink-600 transition-colors duration-300" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 text-center leading-snug group-hover:text-pink-700 transition-colors duration-300">
                                {item.label}
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Tools</h3>
                    
                    {/* QR Code Section */}
                    <div className="space-y-4">
                      <Button
                        onClick={handleQRCodeClick}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-6 text-base font-semibold transition-all duration-200 hover:shadow-lg"
                      >
                        <QrCode className="w-5 h-5 mr-3" />
                        {t('common.displayQR')}
                      </Button>

                      {/* Additional Quick Stats */}
                      <div className="mt-8 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{t('common.profileStatus')}</span>
                            <span className="text-sm font-semibold text-green-600">{t('common.complete')}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{t('common.lastUpdated')}</span>
                            <span className="text-sm font-semibold text-gray-900">Today</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Account Type</span>
                            <span className="text-sm font-semibold text-pink-600">Merchant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* QR Code Modal */}
          <QRCodeModal 
            isOpen={showQRModal} 
            onClose={() => setShowQRModal(false)} 
          />
        </>
      );
} 