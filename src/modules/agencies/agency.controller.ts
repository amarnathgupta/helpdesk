import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import {
  createAgencyService,
  setEmailConfigService,
  updateAgencyService,
} from "./agency.service";
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

export const getAgencyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (req.tenantId && req.tenantId !== id) {
      return errorResponse(res, "Forbidden", 403);
    }

    const agency = await prisma.agency.findUnique({
      where: { id },
    });

    if (!agency) {
      return errorResponse(res, "Agency not found", 404);
    }

    return successResponse(res, 200, "Agency fetched successfully", agency);
  },
);

export const updateAgencyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    const agency = await updateAgencyService(id, {
      name,
      slug,
      isActive,
    });

    return successResponse(res, 200, "Agency updated successfully", agency);
  },
);

export const setEmailConfigController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const config = await setEmailConfigService(id, req.body);

    return successResponse(res, 200, "Email config saved successfully", config);
  },
);
