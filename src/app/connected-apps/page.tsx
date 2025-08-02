"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone, Check, Plus, ExternalLink, Shield } from "lucide-react";

export default function ConnectedAppsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  const connectedApps = [
    {
      id: "foodpanda",
      name: "foodpanda",
      description: "Online food delivery",
      status: "connected",
      logo: "🐼",
      color: "bg-pink-500"
    }
  ];

  const availableApps = [
    {
      id: "grab",
      name: "Grab",
      description: "Food delivery platform",
      status: "available",
      logo: "🍔",
      color: "bg-green-500"
    },
    {
      id: "shopee",
      name: "Shopee",
      description: "E-commerce marketplace",
      status: "available",
      logo: "🛒",
      color: "bg-orange-500"
    },
    {
      id: "lazada",
      name: "Lazada",
      description: "Online shopping platform",
      status: "available",
      logo: "🛍️",
      color: "bg-blue-500"
    },
    {
      id: "pos-malaysia",
      name: "Pos Malaysia",
      description: "Shipping and logistics",
      status: "available",
      logo: "📦",
      color: "bg-yellow-500"
    },
    {
      id: "maybank",
      name: "Maybank",
      description: "Payment gateway",
      status: "available",
      logo: "🏦",
      color: "bg-red-500"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Connected Apps</h1>
                  <p className="text-sm text-gray-600">Manage your integrations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connected Apps Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Connected Apps</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500" />
              <span>{connectedApps.length} apps connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedApps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {app.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Connected</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Settings
                  </button>
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Apps Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Integrations</h2>
            <p className="text-sm text-gray-600">Expand your reach with these platforms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableApps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {app.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-medium">Available</span>
                  </div>
                </div>
                
                {app.id === 'grab' ? (
                  <a
                    href="https://payport-paylord.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect Now
                  </a>
                ) : (
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Connect Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Secure Connections</h3>
              <p className="text-blue-800 text-sm">
                All app integrations use secure OAuth 2.0 authentication and encrypted data transfer. 
                You can revoke access at any time from this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}