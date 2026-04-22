import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import { registerService } from "./auth.service";
import ApiError from "../../utils/apiError";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name, role, agencyId = "" } = req.body;

    if (!email?.trim() || !password?.trim() || !name?.trim() || !role?.trim()) {
      return errorResponse(res, "All fields are required", 400);
    }

    if (!agencyId?.trim()) {
      if (role === "CLIENT" || role === "AGENCY_AGENT") {
        return errorResponse(res, "AgencyId is required", 400);
      }
    }

    try {
      const user = await registerService({
        email,
        password,
        name,
        role,
        agencyId,
      });

      return successResponse(res, 201, "User created successfully", user);
    } catch (error: any) {
      if (error instanceof ApiError) {
        return errorResponse(res, error.message, error.statusCode);
      }
      return errorResponse(res, error.message);
    }
  },
);
