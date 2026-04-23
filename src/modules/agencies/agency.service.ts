import slugify from "slugify";
import { prisma } from "../../config/prisma";
import generateSlug from "../../utils/slug.util";
import ApiError from "../../utils/apiError";
import { encrypt } from "../../utils/crypto.util";

export const createAgencyService = async (name: string, slug?: string) => {
  const cleanName = name.trim();

  let finalSlug: string;

  if (slug?.trim()) {
    finalSlug = slugify(slug, { lower: true, strict: true });

    if (!finalSlug) {
      throw new ApiError("Invalid slug", 400);
    }

    const existing = await prisma.agency.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      throw new ApiError("Slug already exists", 409);
    }
  } else {
    finalSlug = await generateSlug(cleanName);
  }

  try {
    const agency = await prisma.agency.create({
      data: {
        name: cleanName,
        slug: finalSlug,
      },
    });

    return agency;
  } catch (error) {
    throw new ApiError("Slug already exists", 409);
  }
};

export const updateAgencyService = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    isActive?: boolean;
  },
) => {
  const { name, slug, isActive } = payload;

  const data: any = {};

  if (name?.trim()) {
    data.name = name.trim();
  }

  if (slug?.trim()) {
    const normalized = slugify(slug, { lower: true, strict: true });

    if (!normalized) {
      throw new ApiError("Invalid slug", 400);
    }

    const existing = await prisma.agency.findFirst({
      where: {
        slug: normalized,
        NOT: { id },
      },
    });

    if (existing) {
      throw new ApiError("Slug already exists", 409);
    }

    data.slug = normalized;
  }

  if (typeof isActive === "boolean") {
    data.isActive = isActive;
  }

  if (Object.keys(data).length === 0) {
    throw new ApiError("No data to update", 400);
  }

  try {
    const agency = await prisma.agency.update({
      where: { id },
      data,
    });

    return agency;
  } catch (error) {
    throw new ApiError("Agency not found", 404);
  }
};

export const setEmailConfigService = async (agencyId: string, payload: any) => {
  const {
    inboundEmail,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFromName,
    smtpFromEmail,
  } = payload;

  if (!inboundEmail || !smtpHost || !smtpUser || !smtpPass || !smtpFromEmail) {
    throw { message: "Missing required fields", statusCode: 400 };
  }

  const encryptedPass = encrypt(smtpPass);

  const config = await prisma.emailConfig.upsert({
    where: { agencyId },
    update: {
      inboundEmail,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass: encryptedPass,
      smtpFromName,
      smtpFromEmail,
    },
    create: {
      agencyId,
      inboundEmail,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass: encryptedPass,
      smtpFromName,
      smtpFromEmail,
    },
  });

  return config;
};
