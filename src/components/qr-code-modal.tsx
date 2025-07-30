"use client";

import { Button } from "@/components/ui/button";
import { X, Download, Share2, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [qrKey, setQrKey] = useState(Date.now()); // force re-render QR when regenerating

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            // regenerate QR when timer hits 0
            regenerateQR();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const regenerateQR = () => {
    // Here you can fetch a new QR value from backend. For demo we'll just bump the timestamp.
    setQrKey(Date.now());
  };

  // Merchant information to encode in QR code
  const merchantData = {
    businessName: "Nasi Lemak Bangsar",
    merchantId: "MRT-56789",
    contact: "+60387654321",
    email: "info@nasilemakbangsar.com",
    address: "18 Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
    website: "https://payportreal.com/merchant/nasi-lemak-bangsar"
  };

  const qrValue = JSON.stringify({ ...merchantData, ts: qrKey });

  const handleDownload = () => {
    const svgElement = document.getElementById("qr-code-svg");
    if (svgElement && svgElement instanceof SVGElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 256;
      canvas.height = 256;
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.download = "nasi-lemak-bangsar-qr.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(merchantData.website);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: merchantData.businessName,
        text: `Visit ${merchantData.businessName} - Authentic Malaysian Cuisine`,
        url: merchantData.website,
      });
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Merchant QR Code</h2>
            <p className="text-sm text-gray-600">Scan to view merchant profile</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-8 text-center">
          <div className="bg-white p-4 rounded-xl shadow-inner inline-block">
            <QRCode
              key={qrKey}
              id="qr-code-svg"
              value={qrValue}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>

          {/* Countdown */}
          <p className={`mt-4 text-sm font-semibold ${countdown <= 10 ? 'text-red-600' : 'text-green-600'}`}>Regenerates in {countdown}s</p>
          
          {/* Business Info */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {merchantData.businessName}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Merchant ID: {merchantData.merchantId}
            </p>
            <p className="text-sm text-gray-600">
              {merchantData.contact}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
            >
              <Download className="w-5 h-5 mb-1" />
              <span className="text-xs">Download</span>
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
            >
              <Share2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex flex-col items-center py-4 h-auto"
            >
              <Copy className="w-5 h-5 mb-1" />
              <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white"
          >
            Close
          </Button>
        </div>

        {/* QR Code Info */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">QR Code Contains:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Business name and contact information</li>
              <li>• Merchant ID for verification</li>
              <li>• Direct link to merchant profile</li>
              <li>• Address and email details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 