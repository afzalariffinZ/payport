"use client";

import { CheckCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessToast({ 
  isVisible, 
  message, 
  onClose, 
  duration = 4000 
}: SuccessToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-[400px] transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Changes Applied Successfully!
            </h3>
            <p className="text-gray-600 text-sm">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300 ease-linear"
            style={{
              animation: `shrink ${duration}ms linear`,
              width: '100%'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}