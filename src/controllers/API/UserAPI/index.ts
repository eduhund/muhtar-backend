import { Router } from "express";

import { checkUserAuth } from "./utils";
import { changeTeam, validateChangeTeamParams } from "./changeTeam";

const userApiRouter = Router();

userApiRouter.use(checkUserAuth);

userApiRouter.post("/changeTeam", validateChangeTeamParams, changeTeam);

export default userApiRouter;
