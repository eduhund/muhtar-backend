import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { projects, time } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canArchiveTime(
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

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to archive time entry"
  );
}

export default async function archiveTime(
  id: string,
  actorMembership: Membership
) {
  const existingTime = await time.getTimeById(id);
  if (!existingTime) {
    throw new BusinessError("NOT_FOUND", `Time entry not found`);
  }

  const project = await projects.getProjectById(existingTime.projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canArchiveTime(actorMembership, existingTime, project);

  await existingTime.archive(actorMembership);

  return {};
}
