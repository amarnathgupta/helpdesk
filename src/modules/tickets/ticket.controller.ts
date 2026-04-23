import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { createTicketService, getTicketsService } from "./ticket.service";

export const createTicketController = asyncHandler(
  async (req: Request, res: Response) => {
    const { subject, priority } = req.body;

    if (!subject?.trim()) {
      return errorResponse(res, "Subject is required", 400);
    }

    if (!req.tenantId) {
      return errorResponse(res, "Tenant not found", 400);
    }

    if (!req.user) {
      return errorResponse(res, "User not found", 400);
    }

    const ticket = await createTicketService({
      subject,
      priority,
      agencyId: req.tenantId,
      creatorId: req.user.userId,
    });

    return successResponse(res, 201, "Ticket created successfully", ticket);
  },
);

export const getTicketsController = asyncHandler(
  async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);

    const result = await getTicketsService({
      role: req.user.role,
      tenantId: req.tenantId,
      userId: req.user.userId,
      cursor,
      limit,
    });

    return successResponse(res, 200, "Tickets fetched successfully", result, {
      nextCursor: result.nextCursor,
    });
  },
);
