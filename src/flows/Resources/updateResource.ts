import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Resource, { ResourceTarget } from "../../models/Resource";
import {
  membershipService,
  projectService,
  teamService,
  resourceService,
} from "../../services";
import { dateOnlyIsoString } from "../../utils/date";
import { BusinessError } from "../../utils/Rejection";

type updateResourceParams = {
  membershipId?: string;
  projectId?: string;
  date?: Date;
  target?: ResourceTarget | null;
  duration?: number;
  comment?: string;
};

async function canUpdateResource(
  currentMembership: Membership,
  resource: Resource,
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();
  const userMembershipId = userMembership.getId();

  const isMembershipInProject = project.isProjectMembership(userMembershipId);

  if (project.isProjectAdmin(currentMembershipId) && isMembershipInProject)
    return true;

  if (currentMembershipId === userMembershipId && isMembershipInProject)
    return true;

  if (currentMembershipId === resource.membershipId) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update resource"
  );
}

async function getNewMembership(membershipId: string) {
  const membership = await membershipService.getMembershipById(membershipId);
  if (!membership) throw new BusinessError("NOT_FOUND", "Membership not found");
  return membership;
}

async function getNewProject(projectId: string) {
  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");
  return project;
}

export default async function updateTime(
  id: string,
  {
    membershipId,
    projectId,
    date,
    target,
    duration,
    comment,
  }: updateResourceParams,
  actorMembership: Membership
) {
  const resource = await resourceService.getResourceById(id);
  if (!resource) {
    throw new BusinessError("NOT_FOUND", `Resource not found`);
  }

  const newMembership = await getNewMembership(
    membershipId || resource.membershipId
  );
  const newProject = await getNewProject(projectId || resource.projectId);

  await canUpdateResource(actorMembership, resource, newMembership, newProject);
  resource.update(
    {
      membershipId,
      projectId,
      date: date ? dateOnlyIsoString(new Date(date)) : undefined,
      target,
      duration,
      comment,
    },
    actorMembership
  );

  await resourceService.save(resource);

  const richResource = await resourceService.getRichResource({
    resource,
    membership: newMembership,
    project: newProject,
    team: await teamService.getTeamById(newMembership.teamId),
    memberships: await membershipService.getMembershipsByTeam(
      newMembership.teamId
    ),
  });

  return richResource;
}
