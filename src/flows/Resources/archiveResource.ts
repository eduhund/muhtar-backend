import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Resource from "../../models/Resource";
import { projectService, resourceService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canArchiveResource(
  currentMembership: Membership,
  existingResource: Resource,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
    currentMembership.getId()
  );

  if (projectActorMembershipRole === "admin") return true;

  if (currentMembership.getId() === existingResource.membershipId) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to archive resource"
  );
}

export default async function archiveResource(
  id: string,
  actorMembership: Membership
) {
  const resource = await resourceService.getResourceById(id);
  if (!resource) {
    throw new BusinessError("NOT_FOUND", `Resource not found`);
  }

  const project = await projectService.getProjectById(resource.projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canArchiveResource(actorMembership, resource, project);

  resource.archive(actorMembership);
  await resourceService.save(resource);

  return resource;
}
