import { Request, Response } from "express";
import { processLandslideReportWithCNN, listAllReports } from "../services/warningService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getReports = async (req: Request, res: Response): Promise<void> => {
  const reports = await listAllReports();
  res.status(200).json({ success: true, count: reports.length, data: reports });
};

export const uploadReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id || 7;
  const { image_s3_url, latitude, longitude, location_name, details } = req.body;

  if (!image_s3_url || latitude === undefined || longitude === undefined) {
    res.status(400).json({ success: false, error: "image_s3_url, latitude, and longitude are required" });
    return;
  }

  const result = await processLandslideReportWithCNN(userId, {
    image_s3_url,
    latitude: Number(latitude),
    longitude: Number(longitude),
    location_name,
    details,
  });

  res.status(201).json({
    success: true,
    message: result.isHazardVerified
      ? "Landslide photo verified via CNN inference. Active warning broadcast to region."
      : "Report queued and logged. Low confidence threshold.",
    data: result,
  });
};
