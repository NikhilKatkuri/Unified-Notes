import { signin, signup, find, account, refresh } from "@/controllers/index.js";

import express from "express";
import { Router } from "express";

const baseName = "/auth";
const appendBaseName = (path: string) => `${baseName}${path}`;
const authRouter: Router = express.Router({ mergeParams: true });

const updateInV2 = (req: express.Request, res: express.Response) => {
  res.status(501).json({ message: "Not implemented yet" });
};

authRouter.get(baseName, (_req, res) => {
  res.send({
    message: "auth router",
  });
});

authRouter.post(appendBaseName("/signin"), signin);
authRouter.post(appendBaseName("/signup"), signup);
authRouter.post(appendBaseName("/logout"), updateInV2);
authRouter.post(appendBaseName("/refresh"), refresh);
authRouter.post(appendBaseName("/reset-request"), updateInV2);
authRouter.post(appendBaseName("/reset-confirm"), updateInV2);

authRouter.get(appendBaseName("/verify"), updateInV2);
authRouter.get(appendBaseName("/me"), updateInV2);
authRouter.get(appendBaseName("/users"), updateInV2);
authRouter.get(appendBaseName("/find"), find);

authRouter.delete(appendBaseName("/account"), account);
authRouter.put(appendBaseName("/user"), updateInV2);
export { authRouter };
