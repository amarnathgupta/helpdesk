import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.route";
import { errorResponse } from "./utils/apiResponse";
import ApiError from "./utils/apiError";
import agencyRouter from "./modules/agencies/agency.route";
import ticketRouter from "./modules/tickets/ticket.route";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/agencies", agencyRouter);
app.use("/api/tickets", ticketRouter);

// 404 handler
app.use((req, res) => {
  return errorResponse(res, "Route not found", 404);
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof ApiError) {
    return errorResponse(res, err.message, err.statusCode);
  }
  console.error(err.stack);
  return errorResponse(res, "Internal server error", 500);
});

export default app;
