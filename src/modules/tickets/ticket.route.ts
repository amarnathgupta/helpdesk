import { Router } from "express";
import {
  createTicketController,
  getTicketsController,
} from "./ticket.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { allowRoles } from "../../middlewares/role.middleware";
import { Role } from "../../../generated/prisma/enums";

const ticketRouter = Router();

ticketRouter.use(authMiddleware, tenantMiddleware);

ticketRouter.post(
  "/",
  allowRoles(Role.CLIENT, Role.AGENCY_AGENT),
  createTicketController,
);

ticketRouter.get("/", getTicketsController);

export default ticketRouter;
