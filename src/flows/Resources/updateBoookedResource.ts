import Membership from "../../models/Membership";
import Project from "../../models/Project";
import {
  projectService,
  teamService,
  bookedResourceService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canUpdateBookedResource(
  currentMembership: Membership,
  project: Project,
) {
  if (currentMembership.isAdmin()) return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
    currentMembership.getId(),
  );

  if (projectActorMembershipRole === "admin") return true;

  throw new BusinessError(
    "FORBIDDEN",
    "Membership is not allowed to rebook resources",
  );
}

export default async function updateBoookedResource(
  { id, value }: { id: string; value: any },
  actorMembership: Membership,
) {
  const bookedResource = await bookedResourceService.getBookedResourceById(id);
  if (!bookedResource) {
    throw new BusinessError("NOT_FOUND", "Booked resource not found");
  }

  const project = await projectService.getProjectById(bookedResource.projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  const team = await teamService.getTeamById(actorMembership.teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  await canUpdateBookedResource(actorMembership, project);

  bookedResource.changeValue(value, actorMembership);
  await bookedResourceService.save(bookedResource);

  const richResource = await bookedResourceService.getRichBookedResource({
    resource: bookedResource,
    project,
    team,
  });

  return richResource;
}
