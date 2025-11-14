import { Router } from "express";

import { checkMembershipAuth } from "./utils";
import { addTime, validateAddTimeParams } from "./addTime";
import { archiveTime, validateArchiveTimeParams } from "./archiveTime";
import { getProject, validateGetProjectParams } from "./getProject";
import { getProjects, validateGetProjectsParams } from "./getProjects";
import { getTime, validateGetTimeParams } from "./getTime";
import { getTimetable, validateGetTimetableParams } from "./getTimetable";
import { updateTime, validateUpdateTimeParams } from "./updateTime";
import { restoreTime, validateRestoreTimeParams } from "./restoreTime";
import { getMemberships, validategetMembershipsParams } from "./getMemberships";
import {
  addProjectMembership,
  validateAddProjectMembershipParams,
} from "./addProjectMembership";
import {
  updateProjectMembership,
  validateUpdateProjectMembershipParams,
} from "./updateProjectMembership";

import {
  removeProjectMembership,
  validateRemoveProjectMembershipParams,
} from "./removeProjectMembership";
import { createTask, validateCreateTaskParams } from "./createTask";
import { getTasks, validateGetTasksParams } from "./getTasks";
import { updateTask, validateUpdateTaskParams } from "./updateTask";

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);

membershipApiRouter.get("/getProject", validateGetProjectParams, getProject);
membershipApiRouter.get("/getProjects", validateGetProjectsParams, getProjects);
membershipApiRouter.get("/getTime", validateGetTimeParams, getTime);
membershipApiRouter.get(
  "/getTimetable",
  validateGetTimetableParams,
  getTimetable
);

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

membershipApiRouter.get(
  "/getMemberships",
  validategetMembershipsParams,
  getMemberships
);

membershipApiRouter.post(
  "/addProjectMembership",
  validateAddProjectMembershipParams,
  addProjectMembership
);

membershipApiRouter.post(
  "/updateProjectMembership",
  validateUpdateProjectMembershipParams,
  updateProjectMembership
);

membershipApiRouter.post(
  "/removeProjectMembership",
  validateRemoveProjectMembershipParams,
  removeProjectMembership
);

membershipApiRouter.get("/getTasks", validateGetTasksParams, getTasks);
membershipApiRouter.post("/createTask", validateCreateTaskParams, createTask);
membershipApiRouter.post("/updateTask", validateUpdateTaskParams, updateTask);

export default membershipApiRouter;
