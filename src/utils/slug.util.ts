import slugify from "slugify";
import { prisma } from "../config/prisma";

const generateSlug = async (name: string) => {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.agency.findUnique({
      where: { slug },
    });

    if (!existing) break;

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

export default generateSlug;
