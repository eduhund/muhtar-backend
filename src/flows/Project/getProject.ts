import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectService } from "../../services";

function canGetProject(currentMembership: Membership, project: Project) {
  if (
    currentMembership.isOwner() ||
    currentMembership.isAdmin() ||
    project.visibility === "team"
  )
    return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectMembership(currentMembershipId)) return true;
  return false;
}

export default async function getProject(
  { id }: { id: string },
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(id);

  if (!project) return;

  return canGetProject(actorMembership, project)
    ? projectService.getRichProject({ project })
    : undefined;
}
