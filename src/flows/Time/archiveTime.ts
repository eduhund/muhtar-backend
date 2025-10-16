import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { projectService, timeService } from "../../services";
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

  if (projectActorMembershipRole === "admin") return true;

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
  const time = await timeService.getTimeById(id);
  if (!time) {
    throw new BusinessError("NOT_FOUND", `Time entry not found`);
  }

  const project = await projectService.getProjectById(time.projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canArchiveTime(actorMembership, time, project);

  time.archive(actorMembership);
  await timeService.save(time);

  return time;
}
