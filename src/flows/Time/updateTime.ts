import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { memberships, projects, time } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type updateTimeParams = {
  membershipId?: string;
  projectId?: string;
  taskId?: string | null;
  date?: Date;
  duration?: number;
  comment?: string;
};

async function canUpdateTime(
  currentMembership: Membership,
  time: Time,
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();
  const userMembershipId = userMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  const isMembershipInProject = project.isProjectMembership(userMembershipId);

  if (projectActorMembershipRole === "manager" && isMembershipInProject)
    return true;

  if (currentMembershipId === userMembershipId && isMembershipInProject)
    return true;

  if (currentMembershipId === time.membershipId) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update time entry"
  );
}

async function getNewMembership(membershipId: string) {
  const membership = await memberships.getMembershipById(membershipId);
  if (!membership) throw new BusinessError("NOT_FOUND", "Membership not found");
  return membership;
}

async function getNewProject(projectId: string) {
  const project = await projects.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");
  return project;
}

export default async function updateTime(
  id: string,
  {
    membershipId,
    projectId,
    taskId,
    date,
    duration,
    comment,
  }: updateTimeParams,
  actorMembership: Membership
) {
  const existingTime = await time.getTimeById(id);
  if (!existingTime) {
    throw new BusinessError("NOT_FOUND", `Time entry not found`);
  }

  const newMembership = await getNewMembership(
    membershipId || existingTime.membershipId
  );
  const newProject = await getNewProject(projectId || existingTime.projectId);

  await canUpdateTime(actorMembership, existingTime, newMembership, newProject);

  await existingTime.update(
    {
      membershipId,
      projectId,
      taskId,
      date,
      duration,
      comment,
    },
    actorMembership
  );

  return {};
}
