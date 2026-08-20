import { Response } from "express";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id || 7;
  const notifications = await getUserNotifications(userId);
  res.status(200).json({ success: true, count: notifications.length, data: notifications });
};

export const markRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id || 7;
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = await markNotificationRead(Number(idParam), userId);
  res.status(200).json({ success: true, data: updated });
};

export const markAllRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id || 7;
  const result = await markAllNotificationsRead(userId);
  res.status(200).json({ success: true, data: result });
};
