import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { ResourceTarget } from "../../models/Resource";
import {
  projectService,
  teamService,
  resourceService,
  membershipService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type SpendResourceParams = {
  membershipId: string;
  projectId: string;
  type: string;
  date: Date;
  target: ResourceTarget | null;
  duration: number;
  comment: string | null;
};

async function canSpendResource(
  currentMembership: Membership,
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.visibility === "team") return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
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

  throw new BusinessError("FORBIDDEN", "User is not allowed to spend resource");
}

export default async function spendResource(
  {
    membershipId,
    projectId,
    type,
    date,
    target,
    duration,
    comment,
  }: SpendResourceParams,
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

  await canSpendResource(actorMembership, membership, project);

  const resourceData = {
    membershipId: membership.getId(),
    projectId,
    teamId,
    type,
    date,
    target,
    duration,
    comment,
  };

  const newResource = await resourceService.create(
    resourceData,
    actorMembership
  );

  const richResource = await resourceService.getRichResource({
    resource: newResource,
    membership,
    project,
    team,
    memberships: [membership],
  });

  return richResource;
}
