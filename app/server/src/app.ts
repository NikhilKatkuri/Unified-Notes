import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";

import { ENV } from "@/lib/env.js";
import limiter from "@/lib/limiter.js";
import appRouter from "@/router/index.js";
import globalErrorHandler from "@/lib/global.err.js";
import cookieParser from "cookie-parser";

const app: express.Application = express();

if (ENV.isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 1000 }),
);

app.use(compression());

app.use(limiter);

app.use(
  cors({
    origin: ENV.CORS_ORIGINS,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use(
  hpp({
    whitelist: ["sort", "fields"],
  }),
);

// routes
app.use(appRouter);

// global error handler
app.use(globalErrorHandler);
export default app;
