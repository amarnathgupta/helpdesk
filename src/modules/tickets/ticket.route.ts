import { Router } from "express";
import {
  addMessageController,
  createTicketController,
  getTicketByIdController,
  getTicketsController,
  updateTicketController,
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

ticketRouter.put(
  "/:id",
  allowRoles(Role.ADMIN, Role.INTERNAL_AGENT, Role.AGENCY_AGENT),
  updateTicketController,
);

ticketRouter.use(
  allowRoles(Role.CLIENT, Role.AGENCY_AGENT, Role.ADMIN, Role.INTERNAL_AGENT),
);

ticketRouter.get("/:id", getTicketByIdController);
ticketRouter.post("/:id/messages", addMessageController);

export default ticketRouter;
