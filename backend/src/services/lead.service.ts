import pagination from "../utils/pagination.js";
import { LeadStatus } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLeadService = async (
  page: number,
  limit: number,
  search: string,
) => {
  try {
    const { pages, limits, skip } = pagination(page, limit);
    const trimmedSearch = search.trim();

    const where: Prisma.LeadWhereInput | undefined = trimmedSearch
      ? {
          OR: [
            { name: { contains: trimmedSearch, mode: "insensitive" } },
            { email: { contains: trimmedSearch, mode: "insensitive" } },
            { phoneNumber: { contains: trimmedSearch, mode: "insensitive" } },
            { companyName: { contains: trimmedSearch, mode: "insensitive" } },
          ],
        }
      : undefined;

    const countPromise = where
      ? prisma.lead.count({ where })
      : prisma.lead.count();

    const findArgs: Prisma.LeadFindManyArgs = {
      skip,
      take: limits,
      orderBy: {
        createdAt: "desc",
      },
    };

    if (where) {
      // assign when defined to avoid passing `where: undefined`
      (findArgs as any).where = where;
    }

    const leadsPromise = prisma.lead.findMany(findArgs);

    const [totalItems, leads] = await Promise.all([countPromise, leadsPromise]);

    return {
      data: leads,
      pagination: {
        page: pages,
        limit: limits,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limits), 1),
        hasNextPage: pages * limits < totalItems,
        hasPreviousPage: pages > 1,
      },
    };
  } catch (err: unknown) {
    throw new Error("Failed to fetch all the user");
  }
};

export const createLeadService = async (
  name: string,
  email: string,
  phoneNumber: string,
  companyName: string,
  status: LeadStatus,
  notes?: string | null,
) => {
  try {
    const existingLead = await prisma.lead.findFirst({
      where: {
          companyName: companyName
      },
    });

    if (existingLead) {
      throw new Error("Lead already exists");
    }
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phoneNumber,
        companyName,
        status,
        notes: notes ?? null,
      },
    });

    const data = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      companyName: lead.companyName,
      status: lead.status,
      notes: lead.notes,
      createdAt: lead.createdAt,
    };

    return data;
  } catch (err: unknown) {
    throw new Error("Failed to create.");
  }
};

export const updateLeadStatusService = async (
  id: string,
  status: LeadStatus,
) => {
  try {
    const lead = await prisma.lead.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return lead;
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new Error("Lead not found");
    }
    throw new Error("Failed to update the Status.");
  }
};

export const updateLeadDetailService = async (id: string, notes: string | null) => {
  try {
    const lead = await prisma.lead.update({
      where: {
        id: id,
      },
      data: {
        notes: notes,
      },
    });

    return lead;
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new Error("Lead not found");
    }
    throw new Error("Failed to update the details.");
  }
};

export const deleteLeadService = async (id: string) => {
    try{
        const lead = await prisma.lead.delete({
            where:{
                id: id
            }
        });

        return lead;
    }catch(err: any){
         if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new Error("Lead not found");
    }

    throw new Error("Failed to delete lead");
    }
};
