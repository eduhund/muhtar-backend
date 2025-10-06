import { Router } from "express";

import { checkMembershipAuth } from "./utils";
import { addTime, validateAddTimeParams } from "./addTime";
import { getProjects, validateGetProjectsParams } from "./getProjects";
import { getTimeList, validateGetTimeListParams } from "./getTimeList";

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);
membershipApiRouter.get("/getProjects", validateGetProjectsParams, getProjects);
membershipApiRouter.get("/getTimeList", validateGetTimeListParams, getTimeList);
membershipApiRouter.post("/addTime", validateAddTimeParams, addTime);

export default membershipApiRouter;
