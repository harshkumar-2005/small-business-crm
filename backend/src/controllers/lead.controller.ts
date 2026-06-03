import { type Request, type Response } from "express";
import { type createLeadInterface } from "../interface/create.lead.interface.js";
import {
  createLeadService,
  getAllLeadService,
  updateLeadStatusService,
  updateLeadDetailService,
  deleteLeadService,
} from "../services/lead.service.js";

export const getAllLead = async (req: Request, res: Response) => {
  // pagination
  const {
    page = 1,
    limit = 10,
    search = "",
  } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
  };

  try {
    const result = await getAllLeadService(Number(page), Number(limit), search);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Error at controller level",
    });
  }
};

export const createLead = async (
  req: Request<{}, {}, createLeadInterface>,
  res: Response,
) => {
  const { name, email, phoneNumber, companyName, status, notes } = req.body;
  try {
    const data = await createLeadService(
      name,
      email,
      phoneNumber,
      companyName,
      status,
      notes,
    );
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to Create Lead",
    });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const record = await updateLeadStatusService(id as string, status);
    res.status(200).json({
      success: true,
      record: record,
      message: "Status Updated Successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update the status",
    });
  }
};

export const updateLeadDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const record = await updateLeadDetailService(id as string, notes);
    res.status(200).json({
      success: true,
      record: record,
      message: "Details Updated Successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update the details",
    });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const record = await deleteLeadService(id as string);
    res.status(200).json({
      success: true,
      record: record,
      message: "Lead deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete the lead.",
    });
  }
};
