import { BookedResourceTarget } from "../../models/BookedResource";
import Membership from "../../models/Membership";
import Project from "../../models/Project";
import {
  projectService,
  teamService,
  membershipService,
  bookedResourceService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type SpendResourceParams = {
  projectId: string;
  date: Date;
  resource: {
    type: string;
    value: number;
  };
  target: BookedResourceTarget;
};

async function canBookResource(
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
    "Membership is not allowed to book resources",
  );
}

export default async function bookResource(
  { projectId, date, resource, target }: SpendResourceParams,
  actorMembership: Membership,
) {
  const team = await teamService.getTeamById(actorMembership.teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canBookResource(actorMembership, project);

  if (target.type === "worker") {
    const membership = await membershipService.getMembershipById(target.id);
    if (!membership || membership.teamId !== team.getId()) {
      throw new BusinessError("NOT_FOUND", "Membership not found");
    }
  } else if (target.type === "role") {
    // Additional validations for role can be added here
  } else {
    throw new BusinessError("BAD_REQUEST", "Invalid target type");
  }

  const resourceData = {
    teamId: team.getId(),
    projectId,
    date,
    resource,
    target,
  };

  const newResource = await bookedResourceService.create(
    resourceData,
    actorMembership,
  );

  const richResource = await bookedResourceService.getRichBookedResource({
    resource: newResource,
    project,
    team,
  });

  return richResource;
}
