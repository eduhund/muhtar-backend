import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";
import User from "../../models/User";
import Membership from "../../models/Membership";
import { AccessRole } from "../../utils/accessRoles";
import Project from "../../models/Project";

type MembershipParams = {
  membershipId: string;
  accessRole?: AccessRole;
  workRole?: string;
  multiplier?: number;
};

async function canAddMemberships(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.isProjectAdmin(currentMembership.getId())) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add users to the project"
  );
}

export default async function addProjectMembership(
  id: string,
  {
    membershipId,
    accessRole = "guest",
    workRole = "staff",
    multiplier = 1,
  }: MembershipParams,
  actorMembership: Membership
) {
  const project = await projectService.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  await canAddMemberships(actorMembership, project);

  const membership = await membershipService.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("NOT_FOUND", `Membership not found`);
  }

  if (membership.teamId !== project.teamId) {
    throw new BusinessError(
      "FORBIDDEN",
      "Membership does not belong to this project team"
    );
  }

  project.addMembership({
    membershipId: membership.getId(),
    accessRole,
    workRole,
    multiplier,
  });
  await projectService.save(project);

  return {};
}
