import bcrypt from "bcryptjs";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import ApiError from "../../utils/apiError";

type RegisterInput = {
  email: string;
  password: string;
  name: string;
  role: Role;
  agencyId?: string;
};

export const registerService = async ({
  email,
  password,
  name,
  role,
  agencyId,
}: RegisterInput) => {
  if (
    (role === Role.CLIENT || role === Role.AGENCY_AGENT) &&
    agencyId?.trim()
  ) {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
    });

    if (!agency) {
      throw new ApiError("Agency not found", 404);
    }
  } else {
    agencyId = undefined;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
      role,
      agencyId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      agencyId: true,
    },
  });

  return newUser;
};
