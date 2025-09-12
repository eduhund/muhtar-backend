import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { projects, teams, time, memberships } from "../../services";
import { getRichTime } from "../../utils/getRichObject";
import BussinessError from "../../utils/Rejection";

type AddTimeParams = {
  membershipId: string;
  teamId: string;
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

  const projectActorMembershipRole = project.getProjectMembershipRole(
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
  {
    membershipId,
    teamId,
    projectId,
    taskId,
    date,
    duration,
    comment,
  }: AddTimeParams,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError("FORBIDDEN", "You are not a member of this team");
  }

  const membership =
    membershipId && currentMembership.getId() !== membershipId
      ? await memberships.getMembershipById(membershipId)
      : currentMembership;

  const project = await projects.getProjectById(projectId);
  if (!project) throw new BussinessError("NOT_FOUND", "Project not found");

  const team = await teams.getTeamById(teamId);
  if (!team) throw new BussinessError("NOT_FOUND", "Team not found");

  await canAddTime(currentMembership, membership, project);

  const timeData = {
    membershipId: membership.getId(),
    teamId,
    projectId,
    taskId,
    date,
    duration,
    comment,
  };

  const newTime = await time.addTime(timeData, currentMembership);

  const richTime = await getRichTime({
    time: newTime,
    currentMembership,
    membership,
    project,
    team,
  });

  return richTime;
}
