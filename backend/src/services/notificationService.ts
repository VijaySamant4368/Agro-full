import { supabase } from "../config/supabase.js";

export const createNotification = async (data: {
  user_id: number;
  warning_id?: number;
  related_booking_id?: number;
  notification_type: "Push" | "Email" | "SMS";
  title: string;
  message_content: string;
  severity?: "info" | "warning" | "emergency";
}) => {
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
};

export const getUserNotifications = async (userId: number) => {
  const { data, error } = await supabase
    .from("notification_log")
    .select("*")
    .eq("user_id", userId)
    .order("dispatched_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const markNotificationRead = async (notificationId: number, userId: number) => {
  const { data, error } = await supabase
    .from("notification_log")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const markAllNotificationsRead = async (userId: number) => {
  const { error } = await supabase
    .from("notification_log")
    .update({ is_read: true })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return { success: true };
};
