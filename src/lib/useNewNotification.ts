import { useCallback, useEffect, useState } from "react";
import { api_caller, ApiReturn } from "./api_caller";
import { API } from "./api_const";
import toast from "react-hot-toast";

export interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  notification_type: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useNewNotification = (user_id: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null); // to track the action of a specific notification
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bulkActionLoading, setBulkActionLoading] = useState<'read' | 'delete' | null>(null);

  useEffect(() => {
    fetchNotifications();

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}sse-listener/${user_id}`;
    const es = new EventSource(url);

    es.addEventListener("created", (event) => {
      const payload = JSON.parse(event.data);
      console.log("New notification:", payload);
      setNotifications((prev) => [payload.notification, ...prev]);
    });

    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [user_id]);

  // Fetching Notifications
  const fetchNotifications = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const resData: ApiReturn<Notification[]> = await api_caller<
        Notification[]
      >("GET", `${API.NOTIFICATION.GET_ALL}/${user_id}`);

      if (resData.success && resData.data) {
        setNotifications(resData.data);
        console.log("Fetched notifications manually:", resData.data.length);
      } else {
        throw new Error(resData.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Mark a single notification as read
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

  // Delete a single notification 
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

  // Delete All Notiifcations
  const deleteAllNotifications = useCallback(async () => {
    if (bulkActionLoading) return;

    setBulkActionLoading("delete");
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "DELETE",
        API.NOTIFICATION.DELETE_NOTIFICATIONS,
        {
          user_id: user_id
        }
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

  // Mark All Notifications as Read
  const markAllAsRead = useCallback(async () => {
    if (bulkActionLoading) return;

    setBulkActionLoading("read");
    try {
      const resData: ApiReturn<any> = await api_caller<any>(
        "PUT",
        API.NOTIFICATION.UPDATE_NOTIFICATIONs,
        {
          user_id: user_id
        }
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

  // Calculate Unread Messages
  const unreadCount = notifications.filter(noti => !noti.isRead).length;

  return {
    notifications,
    isLoading,
    fetchNotifications,
    unreadCount,
    actionLoadingId,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    markAllAsRead,
    bulkActionLoading
  };
};
