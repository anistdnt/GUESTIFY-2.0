// import React, { useRef, useState } from "react";
// import { space } from "postcss/lib/list";
// import Loadercomp from "../Loader/Loadercomp";
// import { Bell, EnvelopeSimple, XCircle } from "@phosphor-icons/react/dist/ssr";
// import { api_caller, ApiReturn } from "@/lib/api_caller";
// import { API } from "@/lib/api_const";
// import toast from "react-hot-toast";
// import { getCookie, hasCookie } from "cookies-next/client";

// export default function Notification() {
//   const [showNotification, setshowNotification] = useState<boolean>(false);
//   const [notifications, setNotifications] = useState<any[]>();
//   const [loadingNotifications, setLoadingNotifications] =
//     useState<boolean>(false);
//   const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
//   const [bulkActionLoading, setBulkActionLoading] = useState<
//     "read" | "delete" | null
//   >(null);
//   const eventSourceRef = useRef<EventSource | null>(null);

//   // Setup SSE connection for real-time notifications
//     const setupSSEConnection = () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
  
//       if (!hasCookie("authToken")) return;
  
//       const auth_token = getCookie("authToken");
//       const device_token = getCookie("device_token");
//       const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");
//       const apiPath = API.NOTIFICATION.ALL_NOTIFICATIONS.replace(/^\/+/, "");
//       const sseUrl = `${baseUrl}/${apiPath}`;
  
//       const eventSource = new EventSource(`${sseUrl}?auth_token=${auth_token}&device_token=${device_token}`);
//       eventSourceRef.current = eventSource;
  
//       eventSource.onopen = () => {
//         console.log("SSE connection established");
//       };
  
//       eventSource.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log(data, "event update data")
  
//           if (data.initialNotifications) {
//             // Initial load of notifications
//             setNotifications(data.initialNotifications);
//           } else if (data.error) {
//             toast.error(data.error);
//           } else if (data.updateType) {
//             switch (data.updateType) {
//               case "all_deleted":
//                 // Remove all notifications whose _id is in batchIds from state
//                 setNotifications(prev => prev.filter(n => !data.batchIds.includes(n._id)));
//                 toast.success("All notifications deleted");
//                 break;
  
//               case "all_read":
//                 // Mark notifications in batchIds as read
//                 setNotifications(prev => prev.map(n =>
//                   data.batchIds.includes(n._id) ? { ...n, isRead: true } : n
//                 ));
//                 toast.success("All notifications marked as read");
//                 break;
  
//               case "deleted":
//                 // Remove single notification
//                 setNotifications(prev => prev.filter(n => n._id !== data.notification._id));
//                 toast.success("Notification deleted");
//                 break;
  
//               case "updated":
//               case "new":
//                 // Add or update a single notification
//                 const notif = data.notification ?? data.newNotification;
//                 setNotifications(prev => {
//                   if (!prev) return [notif];
//                   const exists = prev.find(n => n._id === notif._id);
//                   if (exists) {
//                     return prev.map(n => n._id === notif._id ? notif : n);
//                   }
//                   return [notif, ...prev];
//                 });
//                 toast.success("Notification updated");
//                 break;
  
//               default:
//                 // Unknown updateType, optionally ignore or log
//                 console.warn("Unknown SSE updateType:", data.updateType);
//                 break;
//             }
//           } else if (data.notification || data.newNotification) {
//             // Fallback case if no updateType but notification present
//             const newNotif = data.notification ?? data.newNotification;
//             setNotifications(prev => {
//               if (!prev) return [newNotif];
//               if (prev.find(n => n._id === newNotif._id)) return prev;
//               return [newNotif, ...prev];
//             });
//             toast.success("New notification received!");
//           }
//         } catch (error) {
//           console.error("Error processing SSE message:", error);
//         }
//       };
  
  
//       eventSource.onerror = (error) => {
//         console.error("SSE connection error:", error);
//         eventSource.close();
//         eventSourceRef.current = null;
//       };
//     };

//   async function handleNotification(e: React.MouseEvent<HTMLButtonElement>) {
//     setshowNotification((prev) => !prev);

//     // Only fetch notifications if we're opening the dropdown and there are no notifications yet
//     // if (!showNotification && (!notifications || notifications.length === 0)) {
//     //   await fetchAllNotifications();
//     // }
//   }

//   const fetchAllNotifications = async () => {
//     setLoadingNotifications(true);
//     try {
//       const resData: ApiReturn<any> = await api_caller<any>(
//         "GET",
//         API.NOTIFICATION.ALL_NOTIFICATIONS
//       );
//       console.log(resData);
//       setNotifications(resData?.data);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   const markNotificationAsRead = async (id: string) => {
//     setActionLoadingId(id);
//     try {
//       const resData: ApiReturn<any> = await api_caller<any>(
//         "PATCH",
//         `${API.NOTIFICATION.UPDATE_NOTIFICATION}/${id}`
//       );
//       if (resData.success) {
//         toast.success(resData.message);
//         // await fetchAllNotifications();
//       } else {
//         toast.error(resData.message);
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const markAllNotificationsAsRead = async () => {
//     setBulkActionLoading("read");
//     try {
//       const resData: ApiReturn<any> = await api_caller<any>(
//         "PUT",
//         API.NOTIFICATION.UPDATE_NOTIFICATIONs
//       );
//       if (resData.success) {
//         toast.success(resData.message);
//         // await fetchAllNotifications();
//       } else {
//         toast.error(resData.message);
//       }
//     } catch (error) {
//       console.error("Error updating all notifications:", error);
//     } finally {
//       setBulkActionLoading(null);
//     }
//   };

//   const deleteNotification = async (id: string) => {
//     setActionLoadingId(id);
//     try {
//       const resData: ApiReturn<any> = await api_caller<any>(
//         "DELETE",
//         `${API.NOTIFICATION.DELETE_NOTIFICATION}/${id}`
//       );
//       if (resData.success) {
//         toast.success(resData.message);
//         // await fetchAllNotifications();
//       } else {
//         toast.error(resData.message);
//       }
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const deleteAllNotifications = async () => {
//     setBulkActionLoading("delete");
//     try {
//       const resData: ApiReturn<any> = await api_caller<any>(
//         "DELETE",
//         API.NOTIFICATION.DELETE_NOTIFICATIONS
//       );
//       if (resData.success) {
//         toast.success(resData.message);
//         // await fetchAllNotifications();
//       } else {
//         toast.error(resData.message);
//       }
//     } catch (error) {
//       console.error("Error deleting all notifications:", error);
//     } finally {
//       setBulkActionLoading(null);
//     }
//   };

//   return (
//     <div>
//       <div className="relative mt-2">
//         <button
//           onClick={handleNotification}
//           data-tooltip="Notifications"
//           data-tooltip-pos="bottom"
//         >
//           <Bell size={24} weight="bold" className="cursor-pointer" />
//         </button>
//         {Array.isArray(notifications) && notifications.length > 0 && (
//           <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
//         )}
//       </div>

//       {/* Notification Dropdown  */}
//       {showNotification && (
//         <div className="absolute right-1 top-14 z-10 mt-2 w-80 max-h-80 origin-top-right rounded-md bg-white py-1 shadow-lg">
//           <span className="px-4"> Notifications</span>
//           <ul className="border-t-[1px] border-black py-2  max-h-64 overflow-y-scroll">
//             {loadingNotifications ? (
//               Array(3)
//                 .fill(0)
//                 .map((_, idx) => (
//                   <li
//                     key={idx}
//                     className="flex items-center gap-4 px-4 py-3 animate-pulse text-sm text-gray-700"
//                   >
//                     <div className="h-6 w-6 bg-gray-300 rounded-full" />
//                     <div className="h-4 bg-gray-300 rounded w-3/4" />
//                   </li>
//                 ))
//             ) : Array.isArray(notifications) && notifications.length > 0 ? (
//               notifications.map((notif: any, idx: number) => (
//                 <li
//                   key={idx}
//                   className="flex flex-row gap-8 justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   <span
//                     className={`flex flex-row items-start gap-2 ${
//                       !notif?.isRead ? "font-bold" : ""
//                     }`}
//                   >
//                     {notif?.notification_type === "transactional" && (
//                       <Bell className="bg-blue-400 p-1 h-7 w-7 text-white rounded-full" />
//                     )}
//                     {notif.message}
//                   </span>
//                   <div className="flex flex-row items-start gap-2 text-gray-400">
//                     <EnvelopeSimple
//                       size={24}
//                       className={`cursor-pointer transition-colors duration-200 ${
//                         actionLoadingId === notif._id
//                           ? "opacity-50 pointer-events-none"
//                           : "hover:text-gray-600"
//                       }`}
//                       onClick={() => markNotificationAsRead(notif._id)}
//                     />
//                     <XCircle
//                       size={24}
//                       className={`cursor-pointer transition-colors duration-200 ${
//                         actionLoadingId === notif._id
//                           ? "opacity-50 pointer-events-none"
//                           : "hover:text-gray-600"
//                       }`}
//                       onClick={() => deleteNotification(notif._id)}
//                     />

//                     {actionLoadingId === notif._id && (
//                       <div className="flex items-center justify-center ml-1">
//                         <Loadercomp size={16} />
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))
//             ) : (
//               <li className="text-sm text-gray-600 px-4 py-3 h-24 flex items-center justify-center w-full">
//                 No Notifications to display
//               </li>
//             )}
//           </ul>

//           <div className="flex flex-row items-center justify-end h-10 gap-4 px-4">
//             <button
//               className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
//               onClick={markAllNotificationsAsRead}
//               disabled={bulkActionLoading === "read"}
//             >
//               {bulkActionLoading === "read" ? (
//                 <Loadercomp size={14} />
//               ) : (
//                 "Read All"
//               )}
//             </button>

//             <button
//               className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
//               onClick={deleteAllNotifications}
//               disabled={bulkActionLoading === "delete"}
//             >
//               {bulkActionLoading === "delete" ? (
//                 <Loadercomp size={14} />
//               ) : (
//                 "Clear All"
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect, useCallback } from "react";
import Loadercomp from "../Loader/Loadercomp";
import { Bell, EnvelopeSimple, XCircle, WifiSlash } from "@phosphor-icons/react/dist/ssr";
import { useNotifications, Notification as NotificationType } from "@/lib/useNotification";

interface NotificationProps {
  autoConnect?: boolean;
  onNewNotification?: (notification: NotificationType) => void;
  showConnectionStatus?: boolean;
}

export default function Notification({ 
  autoConnect = false,
  onNewNotification,
  showConnectionStatus = false 
}: NotificationProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Use the custom hook
  const {
    // State
    sortedNotifications,
    isLoading,
    actionLoadingId,
    bulkActionLoading,
    isConnected,
    
    // Computed values
    hasUnreadNotifications,
    unreadCount,
    
    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    
    // Connection management
    connect,
    disconnect,
    reconnect,
  } = useNotifications({
    autoConnect: autoConnect || showDropdown, // Connect when dropdown opens or autoConnect is true
    onNewNotification: (notification) => {
      // Optional: Auto-open dropdown for new notifications
      // setShowDropdown(true);
      onNewNotification?.(notification);
    },
    onError: (error) => {
      console.error("Notification error:", error);
    }
  });

  // Handle dropdown toggle
  const handleNotificationToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDropdown(prev => {
      const newState = !prev;
      
      // Connect when opening, disconnect when closing (if not autoConnect)
      if (newState && !autoConnect) {
        connect();
      } else if (!newState && !autoConnect) {
        disconnect();
      }
      
      return newState;
    });
  }, [connect, disconnect, autoConnect]);

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

  // Handle reconnection
  const handleReconnect = useCallback(() => {
    reconnect();
  }, [reconnect]);

  return (
    <div className="notification-container">
      <div className="relative mt-2">
        <button
          onClick={handleNotificationToggle}
          data-tooltip="Notifications"
          data-tooltip-pos="bottom"
          className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
          aria-label="Toggle notifications"
        >
          <Bell size={24} weight="bold" className="cursor-pointer" />
          
          {/* Connection status indicator */}
          {showConnectionStatus && !isConnected && (
            <WifiSlash 
              size={12} 
              className="absolute -top-1 -left-1 text-red-500 bg-white rounded-full"
            />
          )}
        </button>
        
        {/* Unread notification badge */}
        {hasUnreadNotifications && (
          <span 
            className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-1 top-14 z-50 mt-2 w-80 max-h-96 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {showConnectionStatus && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    {!isConnected && (
                      <button
                        onClick={handleReconnect}
                        className="text-xs text-blue-600 hover:text-blue-800 ml-1"
                      >
                        Reconnect
                      </button>
                    )}
                  </div>
                )}
                {unreadCount > 0 && (
                  <span className="text-sm text-gray-500">
                    ({unreadCount} unread)
                  </span>
                )}
              </div>
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
            ) : sortedNotifications.length > 0 ? (
              sortedNotifications.map((notif: NotificationType) => (
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
                    !notif.isRead ? "font-medium text-gray-900" : "text-gray-700"
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
          {sortedNotifications.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {sortedNotifications.length} total
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={markAllAsRead}
                  disabled={bulkActionLoading === "read" || sortedNotifications.every(n => n.isRead)}
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
  );
}