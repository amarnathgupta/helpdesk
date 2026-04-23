import type { Response } from "express";

type Meta = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  nextCursor?: string | null;
};
export const successResponse = <T>(
  res: Response,
  status = 200,
  message = "Success",
  data?: T,
  meta?: Meta,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const errorResponse = (
  res: Response,
  message = "Something went wrong",
  status = 500,
) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
  });
};
