import { Request, Response } from "express";
import { listAllFarms, getFarmBySlug, createFarmListing } from "../services/farmService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getFarms = async (req: Request, res: Response): Promise<void> => {
  const { state, district, subdistrict, category, host_id } = req.query;
  const farms = await listAllFarms({
    state: state as string,
    district: district as string,
    subdistrict: subdistrict as string,
    category: category as string,
    host_id: host_id ? Number(host_id) : undefined,
  });
  res.status(200).json({ success: true, count: farms.length, data: farms });
};

export const getFarm = async (req: Request, res: Response): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const farm = await getFarmBySlug(slug);
  res.status(200).json({ success: true, data: farm });
};

export const createFarm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const hostId = req.user?.id || 1;
  const newFarm = await createFarmListing(hostId, req.body);
  res.status(201).json({ success: true, data: newFarm });
};
