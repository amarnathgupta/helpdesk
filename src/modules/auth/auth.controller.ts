import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import { loginService, registerService } from "./auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name, role, agencyId = "" } = req.body;

    if (!email?.trim() || !password?.trim() || !name?.trim() || !role?.trim()) {
      return errorResponse(res, "All fields are required", 400);
    }

    if (!agencyId?.trim()) {
      if (role === "CLIENT" || role === "AGENCY_AGENT") {
        return errorResponse(res, "AgencyId is required", 400);
      }
    }

    const user = await registerService({
      email,
      password,
      name,
      role,
      agencyId,
    });

    return successResponse(res, 201, "User created successfully", user);
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return errorResponse(res, "All fields are required", 400);
    }

    const result = await loginService({ email, password });

    if (req.headers["x-client"] === "mobile") {
      return successResponse(res, 200, "Login successful", {
        token: result.token,
        user: result.user,
      });
    }

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Login successful", {
      user: result.user,
    });
  },
);
