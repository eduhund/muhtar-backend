import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Resource from "../../models/Resource";
import {
  projectService,
  resourceService,
  teamService,
  membershipService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type GetResourceParams = {
  id: string;
};

function canGetResource(
  currentMembership: Membership,
  project: Project,
  resource: Resource
) {
  if (currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectAdmin(currentMembershipId)) return true;

  if (resource.membershipId === currentMembershipId) return true;
  return false;
}

export default async function getResource(
  { id }: GetResourceParams,
  actorMembership: Membership
) {
  const resourceData = await resourceService.getResourceById(id);

  if (!resourceData) {
    throw new BusinessError("NOT_FOUND", "Resource not found");
  }

  const { teamId, projectId, membershipId } = resourceData;
  const membership = await membershipService.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("INTERNAL_ERROR", "Membership not found");
  }

  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new BusinessError("INTERNAL_ERROR", "Project not found");
  }

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("INTERNAL_ERROR", "Team not found");
  }

  const memberships = await membershipService.getMembershipsByTeam(teamId);

  if (!canGetResource(actorMembership, project, resourceData)) {
    throw new BusinessError(
      "FORBIDDEN",
      "You do not have access to this resource"
    );
  }

  return await resourceService.getRichResource({
    resource: resourceData,
    membership,
    project,
    team,
    memberships,
  });
}
