import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import {
  createTicketService,
  getTicketByIdService,
  getTicketsService,
  updateTicketService,
} from "./ticket.service";

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

    return successResponse(
      res,
      200,
      "Tickets fetched successfully",
      { tickets: result["tickets"] },
      {
        nextCursor: result.nextCursor,
      },
    );
  },
);

export const getTicketByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    if (!ticketId) {
      return errorResponse(res, "Ticket ID is required", 400);
    }

    const ticket = await getTicketByIdService({
      ticketId,
      role: req.user.role,
      userId: req.user.userId,
      tenantId: req.tenantId,
    });

    if (!ticket) {
      return errorResponse(res, "Ticket not found or access denied", 404);
    }

    return successResponse(res, 200, "Ticket fetched successfully", ticket);
  },
);

export const updateTicketController = asyncHandler(
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    if (!ticketId) {
      return errorResponse(res, "Ticket ID is required", 400);
    }

    const { status, priority, assignedTo } = req.body;

    const ticket = await updateTicketService({
      ticketId,
      role: req.user.role,
      tenantId: req.tenantId,
      status,
      priority,
      assignedTo,
    });

    if (!ticket) {
      return errorResponse(res, "Ticket not found or access denied", 404);
    }

    return successResponse(res, 200, "Ticket updated successfully", ticket);
  },
);
