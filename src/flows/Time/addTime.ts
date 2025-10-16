import Membership from "../../models/Membership";
import Project from "../../models/Project";
import {
  projectService,
  teamService,
  timeService,
  membershipService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type AddTimeParams = {
  membershipId: string;
  projectId: string;
  taskId?: string | null;
  date: Date;
  duration: number;
  comment: string | null;
};

async function canAddTime(
  currentMembership: Membership,
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const projectActorMembershipRole = await project.getProjectMembershipRole(
    currentMembership.getId()
  );

  const isMembershipInProject = project.isProjectMembership(
    userMembership.getId()
  );

  if (projectActorMembershipRole === "admin" && isMembershipInProject)
    return true;

  if (
    currentMembership.getId() === userMembership.getId() &&
    isMembershipInProject
  )
    return true;

  throw new BusinessError("FORBIDDEN", "User is not allowed to add time");
}

export default async function addTime(
  { membershipId, projectId, taskId, date, duration, comment }: AddTimeParams,
  actorMembership: Membership
) {
  const membership = membershipId
    ? await membershipService.getMembershipById(membershipId)
    : actorMembership;

  if (!membership) {
    throw new BusinessError("NOT_FOUND", "Membership not found");
  }
  const { teamId } = membership;

  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  const team = await teamService.getTeamById(teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  await canAddTime(actorMembership, membership, project);

  const timeData = {
    membershipId: membership.getId(),
    projectId,
    teamId,
    taskId,
    date,
    duration,
    comment,
  };

  const newTime = await timeService.create(timeData, actorMembership);

  const richTime = await timeService.getRichTime({
    time: newTime,
    membership,
    project,
    team,
    memberships: [membership],
  });

  return richTime;
}
