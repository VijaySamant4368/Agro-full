import { supabase, isLiveSupabaseConfigured } from "../config/supabase.js";
import { NotificationLog } from "../types/index.js";

let mockNotifications: NotificationLog[] = [];

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
