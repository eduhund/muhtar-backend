import { Router } from "express";

import { login, validateloginParams } from "./login";
import { register, validateRegisterParams } from "./register";

const authApiRouter = Router();

authApiRouter.post("/login", validateloginParams, login);
authApiRouter.post("/register", validateRegisterParams, register);

export default authApiRouter;
