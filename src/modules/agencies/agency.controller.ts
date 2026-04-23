import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { createAgencyService } from "./agency.service";
import { prisma } from "../../config/prisma";

export const createAgencyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    if (!name?.trim()) {
      return errorResponse(res, "Name is required", 400);
    }

    const agency = await createAgencyService(name, slug);

    return successResponse(res, 201, "Agency created successfully", agency);
  },
);

export const getAgenciesController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);
    const skip = (page - 1) * limit;

    const [agencies, total] = await Promise.all([
      prisma.agency.findMany({
        where: req.tenantId ? { id: req.tenantId } : undefined,
        skip,
        take: limit,
      }),
      prisma.agency.count({
        where: req.tenantId ? { id: req.tenantId } : undefined,
      }),
    ]);
    return successResponse(
      res,
      200,
      "Agencies fetched successfully",
      agencies,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    );
  },
);
