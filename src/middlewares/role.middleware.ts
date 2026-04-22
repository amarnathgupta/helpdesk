import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import type { Role } from "../../generated/prisma/enums";

export const allowRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError("Forbidden", 403);
    }

    next();
  };
};
