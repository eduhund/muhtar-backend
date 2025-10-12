import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canRestoreProject(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  if (projectActorMembershipRole === "admin") return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to restore project"
  );
}

export default async function restoreProject(id: string, currentUser: User) {
  const project = await projectService.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canRestoreProject(currentMembership, project);
  await project.restore(currentMembership);
  return {};
}
