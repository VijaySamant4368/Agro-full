import { Request, Response } from "express";
import {
  getEscrowLedger,
  releaseEscrowToHost,
  refundEscrowToGuest,
} from "../services/escrowService.js";

export const getEscrows = async (req: Request, res: Response): Promise<void> => {
  const ledger = await getEscrowLedger();
  res.status(200).json({ success: true, count: ledger.length, data: ledger });
};

export const releasePayout = async (req: Request, res: Response): Promise<void> => {
  const param = Array.isArray(req.params.paymentId) ? req.params.paymentId[0] : req.params.paymentId;
  const { note } = req.body;
  const result = await releaseEscrowToHost(Number(param), note);
  res.status(200).json({ success: true, message: "Escrow funds released to host", data: result });
};

export const triggerEmergencyRefund = async (req: Request, res: Response): Promise<void> => {
  const param = Array.isArray(req.params.paymentId) ? req.params.paymentId[0] : req.params.paymentId;
  const { reason } = req.body;
  const result = await refundEscrowToGuest(Number(param), reason);
  res.status(200).json({
    success: true,
    message: "100% Emergency Escrow Refund processed successfully",
    data: result,
  });
};
