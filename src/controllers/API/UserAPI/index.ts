import { Router } from "express";

import { checkUserAuth } from "./utils";
import {
  acceptInvitation,
  validateAcceptInvitationParams,
} from "./acceptInvitation";
import { changeTeam, validateChangeTeamParams } from "./changeTeam";
import { createTeam, validateCreateTeamParams } from "./createTeam";
import {
  declineInvitation,
  validateDeclineInvitationParams,
} from "./declineInvitation";
import { getMe } from "./getMe";

const userApiRouter = Router();

userApiRouter.use(checkUserAuth);

userApiRouter.get("/getMe", getMe);
userApiRouter.post(
  "/acceptInvitation",
  validateAcceptInvitationParams,
  acceptInvitation,
);
userApiRouter.post("/changeTeam", validateChangeTeamParams, changeTeam);
userApiRouter.post("/createTeam", validateCreateTeamParams, createTeam);
userApiRouter.post(
  "/declineInvitation",
  validateDeclineInvitationParams,
  declineInvitation,
);

export default userApiRouter;
