import { Router } from "express";

import { login, validateloginParams } from "./login";

const authApiRouter = Router();

authApiRouter.get("/login", validateloginParams, login);

export default authApiRouter;
