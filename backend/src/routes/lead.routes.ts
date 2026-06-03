import express from "express";
import {
  createLead,
  getAllLead,
  updateLeadStatus,
  updateLeadDetails,
  deleteLead,
} from "../controllers/lead.controller.js";

const router = express.Router();

router.get("/all-lead", getAllLead);

router.post("/create-lead", createLead);

router.patch("/update-lead/status/:id", updateLeadStatus);

router.patch("/update-lead/details/:id", updateLeadDetails);

router.delete("/delete-lead/:id", deleteLead);

export default router;
