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
import { archiveTeam } from "./archiveTeam";
import { getTeam } from "./getTeam";
import { getTeams } from "./getTeams";
import { inviteToTeam } from "./inviteToTeam";
import { restoreTeam } from "./restoreTeam";
import { updateTeam } from "./updateTeam";

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
userApiRouter.get("/getTeams", getTeams);
userApiRouter.get("/getTeam/:id", getTeam);
userApiRouter.post("/inviteToTeam/:id", inviteToTeam);
userApiRouter.post("/updateTeam/:id", updateTeam);
userApiRouter.post("/archiveTeam/:id", archiveTeam);
userApiRouter.post("/restoreTeam/:id", restoreTeam);

export default userApiRouter;
