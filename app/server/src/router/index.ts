import express, { Router } from "express";
import { authRouter } from "./auth.js";

const appRouter: Router = express.Router({ mergeParams: true });

const baseName = "/api/v1";

appRouter.get(baseName, (_req, res) => {
  res.send({
    message: "app router",
  });
});

appRouter.use(baseName, authRouter);
export default appRouter;
