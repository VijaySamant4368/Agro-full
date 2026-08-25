import { supabase, isLiveSupabaseConfigured } from "../config/supabase.js";
import { NotificationLog } from "../types/index.js";

let mockNotifications: NotificationLog[] = [];

export const createNotification = async (data: {
  user_id: number;
  warning_id?: number;
  related_booking_id?: number;
  notification_type: "Push" | "Email" | "SMS";
  title: string;
  message_content: string;
  severity?: "info" | "warning" | "emergency";
}) => {
  if (isLiveSupabaseConfigured()) {
    const { data: created, error } = await supabase
      .from("notification_log")
      .insert({
        user_id: data.user_id,
        warning_id: data.warning_id ?? null,
        related_booking_id: data.related_booking_id ?? null,
        notification_type: data.notification_type,
        title: data.title,
        message_content: data.message_content,
        severity: data.severity || "info",
        is_read: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  const notification: NotificationLog = {
    id: mockNotifications.length + 1,
    user_id: data.user_id,
    warning_id: data.warning_id,
    related_booking_id: data.related_booking_id,
    notification_type: data.notification_type,
    title: data.title,
    message_content: data.message_content,
    is_read: false,
    severity: data.severity || "info",
    dispatched_at: new Date().toISOString(),
  };
  mockNotifications.push(notification);
  return notification;
};

export const getUserNotifications = async (userId: number) => {
  if (isLiveSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("notification_log")
      .select("*")
      .eq("user_id", userId)
      .order("dispatched_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  return mockNotifications.filter((n) => n.user_id === userId);
};

export const markNotificationRead = async (notificationId: number, userId: number) => {
  if (isLiveSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("notification_log")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  const notif = mockNotifications.find((n) => n.id === notificationId && n.user_id === userId);
  if (notif) notif.is_read = true;
  return notif;
};

export const markAllNotificationsRead = async (userId: number) => {
  if (isLiveSupabaseConfigured()) {
    const { error } = await supabase
      .from("notification_log")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  }

  mockNotifications.forEach((n) => {
    if (n.user_id === userId) n.is_read = true;
  });
  return { success: true };
};
