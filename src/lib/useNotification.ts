import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { api_caller, ApiReturn } from '@/lib/api_caller';
import { API } from '@/lib/api_const';
import toast from 'react-hot-toast';
import { getCookie, hasCookie } from 'cookies-next/client';
import { decodeToken } from './decodeToken';

// Types
export interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  notification_type: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SSEData {
  initialNotifications?: Notification[];
  error?: string;
  updateType?: 'all_deleted' | 'all_read' | 'deleted' | 'updated' | 'new';
  notification?: Notification;
  newNotification?: Notification;
  batchIds?: string[];
}

interface UseNotificationsProps {
  autoConnect?: boolean;
  onNewNotification?: (notification: Notification) => void;
  onError?: (error: string) => void;
}

interface UseNotificationsReturn {
  // State
  notifications: Notification[];
  isLoading: boolean;
  actionLoadingId: string | null;
  bulkActionLoading: 'read' | 'delete' | null;
  isConnected: boolean;
  
  // Computed values
  hasUnreadNotifications: boolean;
  unreadCount: number;
  sortedNotifications: Notification[];
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  
  // Connection management
  connect: () => void;
  disconnect: () => void;
  reconnect: () => Promise<void>;
}

export const useNotifications = ({
  autoConnect = false,
  onNewNotification,
  onError
}: UseNotificationsProps = {}): UseNotificationsReturn => {
  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState<'read' | 'delete' | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false);

  // Refs
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // Helper function to handle SSE updates
  const handleSSEUpdate = useCallback((data: SSEData) => {
    switch (data.updateType) {
      case "all_deleted":
        setNotifications(prev => 
          prev.filter(n => !data.batchIds?.includes(n._id))
        );
        toast.success("All notifications deleted");
        break;

      case "all_read":
        setNotifications(prev => 
          prev.map(n => 
            data.batchIds?.includes(n._id) ? { ...n, isRead: true } : n
          )
        );
        toast.success("All notifications marked as read");
        break;

      case "deleted":
        if (data.notification?._id) {
          setNotifications(prev => 
            prev.filter(n => n._id !== data.notification!._id)
          );
          toast.success("Notification deleted");
        }
        break;

      case "updated":
        if (data.notification) {
          setNotifications(prev => 
            prev.map(n => 
              n._id === data.notification!._id ? data.notification! : n
            )
          );
          toast.success("Notification updated");
        }
        break;

      case "new":
        const newNotif = data.notification ?? data.newNotification;
        if (newNotif) {
          setNotifications(prev => {
            // Avoid duplicates
            if (prev.find(n => n._id === newNotif._id)) return prev;
            return [newNotif, ...prev];
          });
          toast.success("New notification received!");
          onNewNotification?.(newNotif);
        }
        break;

      default:
        console.warn("Unknown SSE updateType:", data.updateType);
        break;
    }
  }, [onNewNotification]);

  // SSE Connection management
  const connect = useCallback(() => {
    if (eventSourceRef.current || !hasCookie("authToken")) return;

    const auth_token = getCookie("authToken");
    const user_info_fromToken = decodeToken("authToken");
    const device_token = getCookie("device_token");
    const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");
    const apiPath = API.NOTIFICATION.ALL_NOTIFICATIONS.replace(/^\/+/, "");
    const sseUrl = `${baseUrl}/${apiPath}/68c5017acac4208b2c3f118a`;

    console.log("Establishing SSE connection...");
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection established");
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEData = JSON.parse(event.data);
        
        // Handle initial notifications (only once)
        if (data.initialNotifications && !hasInitialFetch) {
          console.log("Received initial notifications:", data.initialNotifications.length);
          setNotifications(data.initialNotifications);
          setHasInitialFetch(true);
        } 
        // Handle real-time updates
        else if (data.updateType) {
          handleSSEUpdate(data);
        }
        // Handle errors
        else if (data.error) {
          toast.error(data.error);
          onError?.(data.error);
        }
        // Fallback for new notifications without updateType
        else if (data.notification || data.newNotification) {
          const newNotif = data.notification ?? data.newNotification;
          if (newNotif && hasInitialFetch) {
            setNotifications(prev => {
              if (prev.find(n => n._id === newNotif._id)) return prev;
              return [newNotif, ...prev];
            });
            toast.success("New notification received!");
            onNewNotification?.(newNotif);
          }
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;

      // Implement exponential backoff for reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
        reconnectAttempts.current += 1;
        
        console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else {
        console.error("Max reconnection attempts reached");
        toast.error("Connection lost. Please refresh the page.");
      }
    };
  }, [handleSSEUpdate, hasInitialFetch, onError, onNewNotification]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
    console.log("SSE connection disconnected");
  }, []);

  // Manual fetch function (fallback)
  const fetchNotifications = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const resData: ApiReturn<Notification[]> = await api_caller<Notification[]>(
        "GET",
        API.NOTIFICATION.ALL_NOTIFICATIONS
      );
      
      if (resData.success && resData.data) {
        setNotifications(resData.data);
        setHasInitialFetch(true);
        console.log("Fetched notifications manually:", resData.data.length);
      } else {
        throw new Error(resData.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications");
      onError?.(error instanceof Error ? error.message : "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onError]);

  // Reconnect function
  const reconnect = useCallback(async () => {
    disconnect();
    reconnectAttempts.current = 0;
    
    // Wait a bit before reconnecting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If we haven't fetched initial notifications, fetch them first
    if (!hasInitialFetch) {
      await fetchNotifications();
    }
    
    connect();
  }, [disconnect, connect, fetchNotifications, hasInitialFetch]);

  // Action functions
  const markAsRead = useCallback(async (id: string) => {
    if (actionLoadingId) return;

    setActionLoadingId(id);
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "PATCH",
        `${API.NOTIFICATION.UPDATE_NOTIFICATION}/${id}`
      );

      if (resData.success) {
        // Optimistic update
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
        toast.success(resData.message || "Notification marked as read");
      } else {
        throw new Error(resData.message || "Failed to update notification");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update notification");
    } finally {
      setActionLoadingId(null);
    }
  }, [actionLoadingId]);

  const markAllAsRead = useCallback(async () => {
    if (bulkActionLoading) return;

    setBulkActionLoading("read");
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "PUT",
        API.NOTIFICATION.UPDATE_NOTIFICATIONs
      );

      if (resData.success) {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success(resData.message || "All notifications marked as read");
      } else {
        throw new Error(resData.message || "Failed to update notifications");
      }
    } catch (error) {
      console.error("Error updating all notifications:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update notifications");
    } finally {
      setBulkActionLoading(null);
    }
  }, [bulkActionLoading]);

  const deleteNotification = useCallback(async (id: string) => {
    if (actionLoadingId) return;

    setActionLoadingId(id);
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "DELETE",
        `${API.NOTIFICATION.DELETE_NOTIFICATION}/${id}`
      );

      if (resData.success) {
        // Optimistic update
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.success(resData.message || "Notification deleted");
      } else {
        throw new Error(resData.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete notification");
    } finally {
      setActionLoadingId(null);
    }
  }, [actionLoadingId]);

  const deleteAllNotifications = useCallback(async () => {
    if (bulkActionLoading) return;

    setBulkActionLoading("delete");
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "DELETE",
        API.NOTIFICATION.DELETE_NOTIFICATIONS
      );

      if (resData.success) {
        // Optimistic update
        setNotifications([]);
        toast.success(resData.message || "All notifications deleted");
      } else {
        throw new Error(resData.message || "Failed to delete notifications");
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete notifications");
    } finally {
      setBulkActionLoading(null);
    }
  }, [bulkActionLoading]);

  // Computed values
  const hasUnreadNotifications = useMemo(
    () => notifications.some(n => !n.isRead),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => {
      // Unread first, then by creation date (newest first)
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    }),
    [notifications]
  );

  // Effects
  useEffect(() => {
    if (autoConnect) {
      // First fetch initial notifications, then connect to SSE
      if (!hasInitialFetch) {
        fetchNotifications().then(() => {
          connect();
        });
      } else {
        connect();
      }
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect, fetchNotifications, hasInitialFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    notifications,
    isLoading,
    actionLoadingId,
    bulkActionLoading,
    isConnected,
    
    // Computed values
    hasUnreadNotifications,
    unreadCount,
    sortedNotifications,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    
    // Connection management
    connect,
    disconnect,
    reconnect,
  };
};