import { Router } from "express";

import { checkMembershipAuth } from "./utils";
import { spendResource } from "./spendResource";
import { archiveResource } from "./archiveResource";
import { getProject } from "./getProject";
import { getProjects } from "./getProjects";
import { getResource } from "./getResource";
import { getResources } from "./getResources";
import { updateResource } from "./updateResource";
import { restoreResource } from "./restoreResource";
import { getMemberships } from "./getMemberships";
import { addMembershipToProject } from "./addMembershipToProject";
import { updateProjectMembership } from "./updateProjectMembership";

import { removeProjectMembership } from "./removeProjectMembership";
import { createTask } from "./createTask";
import { getTasks } from "./getTasks";
import { updateTask } from "./updateTask";
import { archiveTask } from "./archiveTask";
import { restoreTask } from "./restoreTask";
import { createProjectPlan } from "./createProjectPlan";
import { createProjectContract } from "./createProjectContract";
import { createProject } from "./createProject";
import { getBookedResources } from "./getBookedResources";
import { bookResource } from "./bookResource";
import { rebookResource } from "./rebookResource";
import { unbookResource } from "./unbookResource";
import { createWorkRole } from "./createWorkRole";
import { updateMembershipAccessRole } from "./updateMembershipAccessRole";

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);

membershipApiRouter.get("/getProject", getProject);
membershipApiRouter.get("/getProjects", getProjects);
membershipApiRouter.get("/getResource", getResource);
membershipApiRouter.get("/getResources", getResources);

membershipApiRouter.post("/spendResource", spendResource);
membershipApiRouter.post("/archiveResource", archiveResource);
membershipApiRouter.post("/restoreResource", restoreResource);
membershipApiRouter.post("/updateResource", updateResource);
membershipApiRouter.get("/getMemberships", getMemberships);

membershipApiRouter.post("/addMembershipToProject", addMembershipToProject);

membershipApiRouter.post("/updateProjectMembership", updateProjectMembership);

membershipApiRouter.post("/removeProjectMembership", removeProjectMembership);

membershipApiRouter.get("/getTasks", getTasks);
membershipApiRouter.post("/createTask", createTask);
membershipApiRouter.post("/updateTask", updateTask);
membershipApiRouter.post("/archiveTask", archiveTask);
membershipApiRouter.post("/restoreTask", restoreTask);

membershipApiRouter.post("/createProject", createProject);

membershipApiRouter.post("/createProjectPlan", createProjectPlan);

membershipApiRouter.post("/createProjectContract", createProjectContract);

membershipApiRouter.get("/getBookedResources", getBookedResources);

membershipApiRouter.post("/bookResource", bookResource);

membershipApiRouter.post("/rebookResource", rebookResource);

membershipApiRouter.post("/unbookResource", unbookResource);

membershipApiRouter.post("/createWorkRole", createWorkRole);
membershipApiRouter.post(
  "/updateMembershipAccessRole",
  updateMembershipAccessRole,
);

export default membershipApiRouter;
