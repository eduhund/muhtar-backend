import { membershipService, projectService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import Project from "../../models/Project";

async function canRemoveMembershipsFromProject(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.isProjectAdmin(currentMembership.getId())) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to remove users from the project"
  );
}

export default async function removeProjectMembership(
  id: string,
  membershipId: string,
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  await canRemoveMembershipsFromProject(actorMembership, project);

  const membership = await membershipService.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== project.teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this project team"
    );
  }

  project.removeMembership(membership.getId());
  await projectService.save(project);

  return {};
}
