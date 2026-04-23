import { Router } from "express";
import { createTicketController } from "./ticket.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { allowRoles } from "../../middlewares/role.middleware";
import { Role } from "../../../generated/prisma/enums";

const ticketRouter = Router();

ticketRouter.use(
  authMiddleware,
  tenantMiddleware,
  allowRoles(Role.CLIENT, Role.AGENCY_AGENT),
);
ticketRouter.post("/", createTicketController);

export default ticketRouter;
