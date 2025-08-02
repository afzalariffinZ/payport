"use client";

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <div className="relative">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              language === 'en'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ms')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              language === 'ms'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            MY
          </button>
        </div>
      </div>
    </div>
  );
}
