import { Router } from "express";

import { checkUserAuth } from "./utils";
import { acceptInvitation } from "./acceptInvitation";
import { changeTeam } from "./changeTeam";
import { createTeam } from "./createTeam";
import { declineInvitation } from "./declineInvitation";
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
userApiRouter.post("/acceptInvitation", acceptInvitation);
userApiRouter.post("/changeTeam", changeTeam);
userApiRouter.post("/createTeam", createTeam);
userApiRouter.post("/declineInvitation", declineInvitation);
userApiRouter.get("/getTeams", getTeams);
userApiRouter.get("/getTeam", getTeam);
userApiRouter.post("/inviteToTeam", inviteToTeam);
userApiRouter.post("/updateTeam", updateTeam);
userApiRouter.post("/archiveTeam", archiveTeam);
userApiRouter.post("/restoreTeam", restoreTeam);

export default userApiRouter;
