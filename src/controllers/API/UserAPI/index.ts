import { Router } from "express";

import { checkUserAuth } from "./utils";
import { changeTeam, validateChangeTeamParams } from "./changeTeam";
import { getMe } from "./getMe";

const userApiRouter = Router();

userApiRouter.use(checkUserAuth);

userApiRouter.get("/getMe", getMe);
userApiRouter.post("/changeTeam", validateChangeTeamParams, changeTeam);

export default userApiRouter;
