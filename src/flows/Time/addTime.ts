import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { projects, teams, time, memberships } from "../../services";
import { getRichTime } from "../../utils/getRichObject";
import BussinessError from "../../utils/Rejection";

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

  const projectActorMembershipRole = project.getProjectMembershipAccessRole(
    currentMembership.getId()
  );

  const isMembershipInProject = project.isProjectMembership(
    userMembership.getId()
  );

  if (projectActorMembershipRole === "manager" && isMembershipInProject)
    return true;

  if (
    currentMembership.getId() === userMembership.getId() &&
    isMembershipInProject
  )
    return true;

  throw new BussinessError("FORBIDDEN", "User is not allowed to add time");
}

export default async function addTime(
  { membershipId, projectId, taskId, date, duration, comment }: AddTimeParams,
  actorUser: User
) {
  const membership = await memberships.getMembershipById(membershipId);

  if (!membership) {
    throw new BussinessError("NOT_FOUND", "Membership not found");
  }
  const { teamId } = membership;

  const actorMembership = await memberships.getMembership({
    userId: actorUser.getId(),
    teamId,
  });
  if (!actorMembership)
    throw new BussinessError(
      "FORBIDDEN",
      "You are not allowed to add time to this project"
    );

  const project = await projects.getProjectById(projectId);
  if (!project) throw new BussinessError("NOT_FOUND", "Project not found");

  const team = await teams.getTeamById(teamId);
  if (!team) throw new BussinessError("NOT_FOUND", "Team not found");

  await canAddTime(actorMembership, membership, project);

  const timeData = {
    membershipId: membership.getId(),
    projectId,
    taskId,
    date,
    duration,
    comment,
  };

  const newTime = await time.addTime(timeData, actorMembership);

  const richTime = await getRichTime({
    time: newTime,
    membership,
    project,
    team,
  });

  return richTime;
}
