import { Router } from "express";

import { checkUserAuth } from "./utils";
import { changeTeam, validateChangeTeamParams } from "./changeTeam";

const userApiRouter = Router();

userApiRouter.use(checkUserAuth);

userApiRouter.get("/changeTeam", validateChangeTeamParams, changeTeam);

export default userApiRouter;
