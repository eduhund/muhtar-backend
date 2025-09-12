import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { memberships, projects } from "../../services";
import BussinessError from "../../utils/Rejection";

async function canRestoreProject(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  if (projectActorMembershipRole === "manager") return true;
  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to restore project"
  );
}

export default async function restoreProject(id: string, currentUser: User) {
  const project = await projects.getProjectById(id);
  if (!project) {
    throw new BussinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BussinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canRestoreProject(currentMembership, project);
  await project.restore(currentMembership);
  return {};
}
