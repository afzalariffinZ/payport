"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import TransactionChat from "@/components/transaction-chat";

export default function TransactionAnalysisPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  // Dummy transaction data – in real app fetch from API
  const dummyTx = [
    { date: "2025-08-01", amount: 120, category: "Food" },
    { date: "2025-08-01", amount: 60, category: "Drinks" },
    { date: "2025-08-02", amount: 200, category: "Food" },
    { date: "2025-08-02", amount: 40, category: "Dessert" },
    { date: "2025-08-03", amount: 180, category: "Food" },
    { date: "2025-08-03", amount: 90, category: "Drinks" },
    { date: "2025-08-04", amount: 75, category: "Drinks" },
    { date: "2025-08-04", amount: 50, category: "Dessert" },
    { date: "2025-08-05", amount: 220, category: "Food" },
    { date: "2025-08-05", amount: 110, category: "Drinks" },
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransactionChat />
      </div>
    </main>
  );
}
