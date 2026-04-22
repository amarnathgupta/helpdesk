import { Request } from "express";
import type { Role } from "../../generated/prisma/enums";

declare module "express" {
  interface Request {
    user?: {
      userId: string;
      role: Role;
      agencyId?: string;
    };
  }
}

export {};
