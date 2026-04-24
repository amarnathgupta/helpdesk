import { Role, TicketPriority } from "../../../generated/prisma/enums";
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

export const getTicketsService = async ({
  role,
  tenantId,
  userId,
  cursor,
  limit,
}: any) => {
  let where: any = {};

  if (role === "AGENCY_AGENT") {
    where.agencyId = tenantId;
  }

  if (role === "CLIENT") {
    where = {
      creatorId: userId,
    };
  }

  const tickets = await prisma.ticket.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const nextCursor =
    tickets.length === limit ? tickets[tickets.length - 1].id : null;

  return {
    tickets,
    nextCursor,
  };
};

export const getTicketByIdService = async ({
  ticketId,
  role,
  userId,
  tenantId,
}: {
  ticketId: string;
  role: Role;
  userId: string;
  tenantId: string;
}) => {
  let where: any = {
    id: ticketId,
  };

  if (role === Role.AGENCY_AGENT) {
    where.agencyId = tenantId;
  }

  if (role === Role.CLIENT) {
    where.creatorId = userId;
  }

  const ticket = await prisma.ticket.findFirst({
    where,
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return ticket;
};
