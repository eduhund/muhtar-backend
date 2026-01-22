import { Router } from "express";

import { checkMembershipAuth } from "./utils";
import { spendResource, validateSpendResourceParams } from "./spendResource";
import {
  archiveResource,
  validateArchiveResourceParams,
} from "./archiveResource";
import { getProject, validateGetProjectParams } from "./getProject";
import { getProjects, validateGetProjectsParams } from "./getProjects";
import { getResource, validateGetResourceParams } from "./getResource";
import { getResources, validateGetResourcesParams } from "./getResources";
import { updateResource, validateUpdateResourceParams } from "./updateResource";
import {
  restoreResource,
  validateRestoreResourceParams,
} from "./restoreResource";
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
import { archiveTask, validateArchiveTaskParams } from "./archiveTask";
import { restoreTask, validateRestoreTaskParams } from "./restoreTask";
import {
  createProjectPlan,
  validateCreateProjectPlanParams,
} from "./createProjectPlan";
import {
  createProjectContract,
  validateCreateProjectContractParams,
} from "./createProjectContract";
import { createProject, validateCreateProjectParams } from "./createProject";

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);

membershipApiRouter.get("/getProject", validateGetProjectParams, getProject);
membershipApiRouter.get("/getProjects", validateGetProjectsParams, getProjects);
membershipApiRouter.get("/getResource", validateGetResourceParams, getResource);
membershipApiRouter.get(
  "/getResources",
  validateGetResourcesParams,
  getResources
);

membershipApiRouter.post(
  "/spendResource",
  validateSpendResourceParams,
  spendResource
);
membershipApiRouter.post(
  "/archiveResource",
  validateArchiveResourceParams,
  archiveResource
);
membershipApiRouter.post(
  "/restoreResource",
  validateRestoreResourceParams,
  restoreResource
);
membershipApiRouter.post(
  "/updateResource",
  validateUpdateResourceParams,
  updateResource
);
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
membershipApiRouter.post(
  "/archiveTask",
  validateArchiveTaskParams,
  archiveTask
);
membershipApiRouter.post(
  "/restoreTask",
  validateRestoreTaskParams,
  restoreTask
);

membershipApiRouter.post(
  "/createProject",
  validateCreateProjectParams,
  createProject
);

membershipApiRouter.post(
  "/createProjectPlan",
  validateCreateProjectPlanParams,
  createProjectPlan
);

membershipApiRouter.post(
  "/createProjectContract",
  validateCreateProjectContractParams,
  createProjectContract
);

export default membershipApiRouter;
