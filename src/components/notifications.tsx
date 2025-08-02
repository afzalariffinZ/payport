"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentData } from "@/lib/document-data-store";
import { Bell, X, Check, AlertCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  className?: string;
}

export default function Notifications({ className = "" }: NotificationsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user name - you can replace this with actual user data from your auth/profile system
  const getUserName = () => {
    // For now, using a default name. In a real app, this would come from user authentication/profile data
    // You could get this from localStorage, a user context, or API call
    return "Aisyah"; // This matches the ownerName from personal-information component
  };

  const userName = getUserName();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Pre-Approved Business Loan! 🎉",
      message: `Hi ${userName}, you're pre-approved for a RM3,000 business loan from Bank Islam to grow your business. Ready to boost your next move?`,
      type: "success",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
      id: "2",
      title: "Document Verification",
      message: "Your business license has been successfully verified.",
      type: "success",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: false,
    },
    {
      id: "3",
      title: "Welcome to PayPort!",
      message: "Complete your profile to get started with our AI-powered merchant platform.",
      type: "info",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    markAsRead(notification.id);
    
    // Navigate based on notification type or content
    if (notification.title.includes("Pre-Approved Business Loan") || notification.title.includes("loan")) {
      router.push("/loan-investment-incentive");
      setIsOpen(false);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Icon */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notifications Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      !notification.read ? 'bg-pink-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium text-gray-900 ${
                              !notification.read ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-pink-600 hover:text-pink-700 font-medium mt-2"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
