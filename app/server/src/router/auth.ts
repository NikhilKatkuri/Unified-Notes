import { signin, signup, find, account } from "@/controllers/index.js";

import express from "express";
import { Router } from "express";

const baseName = "/auth";
const appendBaseName = (path: string) => `${baseName}${path}`;
const authRouter: Router = express.Router({ mergeParams: true });

authRouter.get(baseName, (_req, res) => {
  res.send({
    message: "auth router",
  });
});

authRouter.post(appendBaseName("/signin"), signin);
authRouter.post(appendBaseName("/signup"), signup);
authRouter.post(appendBaseName("/logout"));
authRouter.post(appendBaseName("/refresh"));
authRouter.post(appendBaseName("/reset-request"));
authRouter.post(appendBaseName("/reset-confirm"));

authRouter.get(appendBaseName("/verify"));
authRouter.get(appendBaseName("/me"));
authRouter.get(appendBaseName("/users"));
authRouter.get(appendBaseName("/find"), find);

authRouter.delete(appendBaseName("/account"), account);
authRouter.put(appendBaseName("/user"));
export { authRouter };
