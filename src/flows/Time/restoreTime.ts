import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import User from "../../models/User";
import { memberships, projects, time } from "../../services";
import BussinessError from "../../utils/Rejection";

async function canRestoreTime(
  currentMembership: Membership,
  existingTime: Time,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
    currentMembership.getId()
  );

  if (projectActorMembershipRole === "manager") return true;

  if (currentMembership.getId() === existingTime.membershipId) return true;

  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to restore time entry"
  );
}

export default async function restoreTime(id: string, currentUser: User) {
  const existingTime = await time.getTimeById(id);
  if (!existingTime) {
    throw new BussinessError("NOT_FOUND", `Time entry not found`);
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: existingTime.teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  const project = await projects.getProjectById(existingTime.projectId);
  if (!project) throw new BussinessError("NOT_FOUND", "Project not found");

  await canRestoreTime(currentMembership, existingTime, project);

  await existingTime.restore(currentMembership);

  return {};
}
