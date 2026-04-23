import { Router } from "express";
import {
  createAgencyController,
  getAgenciesController,
} from "./agency.controller";
import { allowRoles } from "../../middlewares/role.middleware";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";

const agencyRouter = Router();

agencyRouter.use(authMiddleware);

agencyRouter.post("/", allowRoles(Role.ADMIN), createAgencyController);

agencyRouter.get(
  "/",
  tenantMiddleware,
  allowRoles(Role.ADMIN, Role.INTERNAL_AGENT, Role.AGENCY_AGENT),
  getAgenciesController,
);
export default agencyRouter;
