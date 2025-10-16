import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { membershipService, projectService, timeService } from "../../services";
import { getRichProject } from "../../utils/getRichObject";
import { BusinessError } from "../../utils/Rejection";

function canGetProject(currentMembership: Membership, project: Project) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

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
    ? getRichProject(project)
    : undefined;
}
