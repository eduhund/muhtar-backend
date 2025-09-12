import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { memberships, projects } from "../../services";
import BusinessError from "../../utils/Rejection";

async function canArchiveProject(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  if (projectActorMembershipRole === "manager") return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to archive the project"
  );
}

export default async function archiveProject(id: string, currentUser: User) {
  const existingProject = await projects.getProjectById(id);
  if (!existingProject) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: existingProject.teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canArchiveProject(currentMembership, existingProject);
  await existingProject.archive(currentMembership);
  return {};
}
