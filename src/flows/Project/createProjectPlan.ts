import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectPlanService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

function canCreateProjectPlan(currentMembership: Membership, project: Project) {
  if (currentMembership.isAdmin()) return true;
  if (project.isProjectAdmin(currentMembership.getId())) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to create plan in this project"
  );
}

export default async function createProjectPlan(
  projectPlanData: any,
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(
    projectPlanData.projectId
  );
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  canCreateProjectPlan(actorMembership, project);

  const newProjectPlan = await projectPlanService.createPlan(
    projectPlanData,
    actorMembership
  );

  return newProjectPlan;
}
