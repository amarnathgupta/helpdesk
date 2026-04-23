import { Router } from "express";
import {
  createAgencyController,
  getAgenciesController,
  getAgencyController,
  updateAgencyController,
} from "./agency.controller";
import { allowRoles } from "../../middlewares/role.middleware";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";

const agencyRouter = Router();

agencyRouter.use(authMiddleware);

agencyRouter.post("/", allowRoles(Role.ADMIN), createAgencyController);
agencyRouter.put("/:id", allowRoles(Role.ADMIN), updateAgencyController);

agencyRouter.use(
  tenantMiddleware,
  allowRoles(Role.ADMIN, Role.INTERNAL_AGENT, Role.AGENCY_AGENT),
);

agencyRouter.get("/", getAgenciesController);
agencyRouter.get("/:id", getAgencyController);

export default agencyRouter;
