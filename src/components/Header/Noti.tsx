import { useNewNotification } from "@/lib/useNewNotification";
import { Bell, EnvelopeSimple, XCircle } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import Loadercomp from "../Loader/Loadercomp";

type Props = {
  user_id: string;
};

export interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  notification_type: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Noti({user_id}: Props) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { notifications, isLoading, unreadCount, actionLoadingId, markAsRead, deleteNotification, bulkActionLoading, deleteAllNotifications, markAllAsRead } = useNewNotification(user_id);

  // Click outside handler
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showDropdown && !(event.target as Element)?.closest('.notification-container')) {
          setShowDropdown(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showDropdown]);

  return <div>
    <div className="notification-container">
      <div className="relative mt-2">
        <button
          onClick={()=> setShowDropdown((prev)=> !prev)}
          data-tooltip="Notifications"
          data-tooltip-pos="bottom"
          className="relative focus:outline-none rounded-full p-1"
          aria-label="Toggle notifications"
        >
          <Bell size={24} weight="bold" className="cursor-pointer" />
        </button>
        
        {/* Unread notification badge */}
        {unreadCount > 0 && <span 
            className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
        </span>}
      </div>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-1 top-14 z-50 mt-2 w-80 max-h-96 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 animate-pulse border-b border-gray-100 last:border-b-0"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-6 w-6 bg-gray-300 rounded" />
                    <div className="h-6 w-6 bg-gray-300 rounded" />
                  </div>
                </div>
              ))
            ) : notifications.length > 0 ? (
              notifications.map((notif: Notification) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                    !notif.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Notification Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {notif.notification_type === "transactional" ? (
                      <Bell 
                        className="h-6 w-6 p-1 bg-blue-500 text-white rounded-full" 
                        aria-hidden="true"
                      />
                    ) : (
                      <div className={`h-2 w-2 rounded-full mt-2 ${!notif.isRead ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`flex-1 min-w-0 ${
                    !notif.isRead ? "font-semibold text-gray-900" : "text-gray-700"
                  }`}>
                    <p className="text-sm break-words">{notif.message}</p>
                    {notif.createdAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        disabled={actionLoadingId === notif._id}
                        className={`p-1.5 rounded-md transition-all duration-200 ${
                          actionLoadingId === notif._id
                            ? "opacity-50 cursor-not-allowed"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        aria-label="Mark as read"
                        title="Mark as read"
                      >
                        <EnvelopeSimple size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      disabled={actionLoadingId === notif._id}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        actionLoadingId === notif._id
                          ? "opacity-50 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                      aria-label="Delete notification"
                      title="Delete notification"
                    >
                      <XCircle size={16} />
                    </button>

                    {actionLoadingId === notif._id && (
                      <div className="flex items-center justify-center p-1.5">
                        <Loadercomp size={14} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Bell size={48} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  You'll see new notifications here
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {notifications.length} total
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={markAllAsRead}
                  disabled={bulkActionLoading === "read"}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  {bulkActionLoading === "read" ? (
                    <>
                      <Loadercomp size={12} />
                      <span>Reading...</span>
                    </>
                  ) : (
                    "Mark All Read"
                  )}
                </button>

                <button
                  onClick={deleteAllNotifications}
                  disabled={bulkActionLoading === "delete"}
                  className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  {bulkActionLoading === "delete" ? (
                    <>
                      <Loadercomp size={12} />
                      <span>Clearing...</span>
                    </>
                  ) : (
                    "Clear All"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>;
}
