"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, TrendingUp, Gift, Building, Users, Clock, CheckCircle } from "lucide-react";

export default function LoanInvestmentIncentivePage() {
  const router = useRouter();

  // Get user name - matches the name used in notifications
  const getUserName = () => {
    // For now, using a default name. In a real app, this would come from user authentication/profile data
    return "Aisyah"; // This matches the ownerName from personal-information component
  };

  const userName = getUserName();

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
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Financial Opportunities</h1>
                  <p className="text-sm text-gray-600">Loans, Investments & Incentives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Loan Offer */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Pre-Approved</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Hi {userName}! 🎉</h2>
                <p className="text-lg mb-6 leading-relaxed">
                  You're pre-approved for a <span className="font-bold text-2xl">RM3,000</span> business loan from Bank Islam to grow your business. Ready to boost your next move?
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Quick approval</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">Low interest rates</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="text-sm">Bank Islam</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Apply Now
                  </button>
                  <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="hidden md:block ml-8">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Business Loans */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Loans</h3>
            <p className="text-gray-600 mb-6">Access funding to expand your business operations and reach new markets.</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount Range</span>
                <span className="text-sm font-medium">RM1,000 - RM50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Interest Rate</span>
                <span className="text-sm font-medium">From 6.5% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tenure</span>
                <span className="text-sm font-medium">12 - 60 months</span>
              </div>
            </div>
            <button className="w-full bg-blue-50 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              View Options
            </button>
          </div>

          {/* Investment Opportunities */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Programs</h3>
            <p className="text-gray-600 mb-6">Join investment programs designed for small and medium businesses.</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Min Investment</span>
                <span className="text-sm font-medium">RM500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expected Returns</span>
                <span className="text-sm font-medium">8-12% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Risk Level</span>
                <span className="text-sm font-medium">Moderate</span>
              </div>
            </div>
            <button className="w-full bg-green-50 text-green-600 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors">
              Explore Investments
            </button>
          </div>

          {/* Government Incentives */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Government Incentives</h3>
            <p className="text-gray-600 mb-6">Access government grants and incentives for business development.</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Grant Amount</span>
                <span className="text-sm font-medium">Up to RM10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Eligibility</span>
                <span className="text-sm font-medium">SME businesses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Processing</span>
                <span className="text-sm font-medium">2-4 weeks</span>
              </div>
            </div>
            <button className="w-full bg-purple-50 text-purple-600 py-3 rounded-lg font-medium hover:bg-purple-100 transition-colors">
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Applications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bank Islam Business Loan</p>
                  <p className="text-sm text-gray-500">RM3,000 • Applied 2 days ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Under Review
              </span>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No other applications yet</p>
              <p className="text-sm">Apply for loans, investments, or incentives to see them here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
