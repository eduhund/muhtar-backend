import { Router } from "express";

import { login, validateloginParams } from "./login";

const authApiRouter = Router();

authApiRouter.post("/login", validateloginParams, login);

export default authApiRouter;
