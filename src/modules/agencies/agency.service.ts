import slugify from "slugify";
import { prisma } from "../../config/prisma";
import generateSlug from "../../utils/slug.util";
import ApiError from "../../utils/apiError";

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
