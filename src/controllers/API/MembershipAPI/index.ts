import { Router } from "express";

import { checkMembershipAuth } from "./utils";
import { addTime, validateAddTimeParams } from "./addTime";
import { archiveTime, validateArchiveTimeParams } from "./archiveTime";
import { getProjects, validateGetProjectsParams } from "./getProjects";
import { getTime, validateGetTimeParams } from "./getTime";
import { updateTime, validateUpdateTimeParams } from "./updateTime";
import { restoreTime, validateRestoreTimeParams } from "./restoreTime";

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);

membershipApiRouter.get("/getProjects", validateGetProjectsParams, getProjects);
membershipApiRouter.get("/getTime", validateGetTimeParams, getTime);

membershipApiRouter.post("/addTime", validateAddTimeParams, addTime);
membershipApiRouter.post(
  "/archiveTime",
  validateArchiveTimeParams,
  archiveTime
);
membershipApiRouter.post(
  "/restoreTime",
  validateRestoreTimeParams,
  restoreTime
);
membershipApiRouter.post("/updateTime", validateUpdateTimeParams, updateTime);

export default membershipApiRouter;
