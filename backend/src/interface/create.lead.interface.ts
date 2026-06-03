import {LeadStatus} from "@prisma/client";

interface createLeadInterface {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  status: LeadStatus;
  notes?: string;
}

export type {createLeadInterface};