import { TicketPriority } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";

export const createTicketService = async (data: {
  subject: string;
  priority?: TicketPriority;
  agencyId: string;
  creatorId: string;
}) => {
  const { subject, priority, agencyId, creatorId } = data;

  const ticket = await prisma.ticket.create({
    data: {
      subject: subject.trim(),
      priority: priority || TicketPriority.MEDIUM,
      agencyId,
      creatorId,
    },
  });

  return ticket;
};
