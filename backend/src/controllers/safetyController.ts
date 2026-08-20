import { Request, Response } from "express";
import { getAnnualMatrixForDistrict, evaluateSafetyStatus } from "../services/safetyService.js";

export const getMatrix = async (req: Request, res: Response): Promise<void> => {
  const { district, year } = req.query;
  if (!district) {
    res.status(400).json({ success: false, error: "district parameter is required" });
    return;
  }

  const records = await getAnnualMatrixForDistrict(
    district as string,
    year ? Number(year) : 2026
  );
  res.status(200).json({ success: true, count: records.length, data: records });
};

export const querySafetyStatus = async (req: Request, res: Response): Promise<void> => {
  const { state, district, latitude, longitude, date } = req.query;
  if (!state || !district) {
    res.status(400).json({ success: false, error: "state and district parameters are required" });
    return;
  }

  const result = await evaluateSafetyStatus({
    state: state as string,
    district: district as string,
    latitude: latitude ? Number(latitude) : undefined,
    longitude: longitude ? Number(longitude) : undefined,
    date: date as string,
  });

  res.status(200).json({ success: true, data: result });
};
