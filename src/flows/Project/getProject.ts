import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

function canGetProject(currentMembership: Membership, project: Project) {
  if (currentMembership.isAdmin() || project.visibility === "team") return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectMembership(currentMembershipId)) return true;
  return false;
}

export default async function getProject(
  { id }: { id: string },
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(id);

  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  if (!canGetProject(actorMembership, project))
    throw new BusinessError(
      "UNAUTHORIZED",
      "You are not allowed to access this project"
    );

  return projectService.getRichProject({ project });
}
