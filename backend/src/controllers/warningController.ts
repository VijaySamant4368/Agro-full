import { Request, Response } from "express";
import {
  listAllWarnings,
  issueHostManualWarning,
} from "../services/warningService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getWarnings = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  const warnings = await listAllWarnings(status as string);
  res.status(200).json({ success: true, count: warnings.length, data: warnings });
};

export const issueWarning = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const hostId = req.user?.id || 1;
  const { farm_id, title, description, severity, epicenter_lat, epicenter_lng, impact_radius_km, duration_hours } = req.body;

  if (!title || epicenter_lat === undefined || epicenter_lng === undefined) {
    res.status(400).json({ success: false, error: "title, epicenter_lat, and epicenter_lng are required" });
    return;
  }

  const warning = await issueHostManualWarning(hostId, {
    farm_id: farm_id ? Number(farm_id) : undefined,
    title,
    description,
    severity: severity || "High",
    epicenter_lat: Number(epicenter_lat),
    epicenter_lng: Number(epicenter_lng),
    impact_radius_km: impact_radius_km ? Number(impact_radius_km) : 10.0,
    duration_hours: duration_hours ? Number(duration_hours) : 48,
  });

  res.status(201).json({
    success: true,
    message: "Manual hazard warning logged & broadcast dispatched.",
    data: warning,
  });
};
