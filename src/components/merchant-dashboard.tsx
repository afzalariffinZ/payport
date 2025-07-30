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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentData } from "@/lib/document-data-store";
import BusinessInformation from "./business-information";
import PersonalInformation from "./personal-information";
import BankInformation from "./bank-information";
import CompanyContact from "./company-contact";
import Documents from "./documents";
import FoodMenu from "./food-menu";
import QRCodeModal from "./qr-code-modal";

interface MenuItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}

export default function MerchantDashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'business-info' | 'personal-info' | 'bank-info' | 'company-contact' | 'documents' | 'food-menu'>('dashboard');
  const [showQRModal, setShowQRModal] = useState(false);
  
  const { pendingNavigation } = useDocumentData();

  // Handle AI navigation requests
  useEffect(() => {
    if (pendingNavigation.targetPage && pendingNavigation.targetPage !== currentView) {
      console.log('AI navigation request to:', pendingNavigation.targetPage);
      setCurrentView(pendingNavigation.targetPage as any);
    }
  }, [pendingNavigation.targetPage, currentView]);

  const handleMenuItemClick = (itemName: string) => {
    console.log(`${itemName} clicked`);
    
    switch (itemName) {
      case "Business Information":
        setCurrentView('business-info');
        break;
      case "Personal Information":
        setCurrentView('personal-info');
        break;
      case "Company Contact":
        setCurrentView('company-contact');
        break;
      case "Bank Information":
        setCurrentView('bank-info');
        break;
      case "Documents":
        setCurrentView('documents');
        break;
      case "Food Menu":
        setCurrentView('food-menu');
        break;
      default:
        console.log(`${itemName} functionality coming soon`);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const menuItems: MenuItem[] = [
    {
      icon: Building2,
      label: "Business Information",
      onClick: () => handleMenuItemClick("Business Information"),
    },
    {
      icon: User,
      label: "Personal Information",
      onClick: () => handleMenuItemClick("Personal Information"),
    },
    {
      icon: Phone,
      label: "Company Contact",
      onClick: () => handleMenuItemClick("Company Contact"),
    },
    {
      icon: Landmark,
      label: "Bank Information",
      onClick: () => handleMenuItemClick("Bank Information"),
    },
    {
      icon: FileText,
      label: "Documents",
      onClick: () => handleMenuItemClick("Documents"),
    },
    {
      icon: UtensilsCrossed,
      label: "Food Menu",
      onClick: () => handleMenuItemClick("Food Menu"),
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

  // Render different pages based on current view
  switch (currentView) {
    case 'business-info':
      return <BusinessInformation onBack={handleBackToDashboard} />;
    case 'personal-info':
      return <PersonalInformation onBack={handleBackToDashboard} />;
    case 'bank-info':
      return <BankInformation onBack={handleBackToDashboard} />;
    case 'company-contact':
      return <CompanyContact onBack={handleBackToDashboard} />;
    case 'documents':
      return <Documents onBack={handleBackToDashboard} />;
    case 'food-menu':
      return <FoodMenu onBack={handleBackToDashboard} />;
    default:
      // Render main dashboard
      return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header/Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Merchant Dashboard</h1>
                      <p className="text-sm text-gray-600">PayPort Real</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
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
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          {/* Placeholder logo - replace with actual image */}
                          <Store className="w-12 h-12 text-white" />
                        </div>
                        <div className="mt-4">
                          <h1 className="text-2xl font-bold text-pink-600 mb-1">Nasi Lemak Bangsar</h1>
                          <p className="text-sm text-gray-500">Authentic Malaysian Cuisine</p>
                        </div>
                      </div>

                      {/* Welcome Message */}
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                          Hi, Aisyah Binti Ramli
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Manage your merchant profile with ease
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className="group flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-pink-50 rounded-xl transition-all duration-200 min-h-[140px] hover:shadow-md hover:scale-105 border border-transparent hover:border-pink-200"
                            aria-label={`Navigate to ${item.label}`}
                          >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                              <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-pink-600 transition-colors duration-200" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 text-center leading-snug group-hover:text-pink-700 transition-colors duration-200">
                              {item.label}
                            </span>
                          </button>
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
                        Display QR Code
                      </Button>

                      {/* Additional Quick Stats */}
                      <div className="mt-8 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Profile Status</span>
                            <span className="text-sm font-semibold text-green-600">Complete</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Last Updated</span>
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
} 