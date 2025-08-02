"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Clock, TrendingUp, AlertCircle } from "lucide-react";

export default function TransactionAnalysisPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Transaction Analysis</h1>
                  <p className="text-sm text-gray-600">Advanced analytics for your business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Coming Soon Section */}
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-lg text-gray-600 mb-6">
              We're building powerful transaction analytics to help you understand your business better.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to expect:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Real-time sales analytics and trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Detailed transaction reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-700">Peak hours and customer insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700">Smart alerts and recommendations</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-pink-800 font-medium">
                📧 Want to be notified when this feature launches? We'll update you automatically!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
