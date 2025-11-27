import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectContractService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

function canCreateProjectContract(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.isProjectAdmin(currentMembership.getId())) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to create contract in this project"
  );
}

export default async function createProjectContract(
  projectContractData: any,
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(
    projectContractData.projectId
  );
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  canCreateProjectContract(actorMembership, project);

  const newProjectContract = await projectContractService.createContract(
    projectContractData,
    actorMembership
  );

  return newProjectContract;
}
