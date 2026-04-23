import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { Role } from "../../generated/prisma/enums";

export const tenantMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new ApiError("Unauthorized", 401);
    }

    const { role, agencyId } = user;
    if (role == Role.CLIENT || role == Role.AGENCY_AGENT) {
      req.tenantId = agencyId;
    } else {
      req.tenantId = null;
    }

    next();
  },
);
