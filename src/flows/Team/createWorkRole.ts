import { teamService, workRoleService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import { resourceRate } from "../../models/WorkRole";

export type NewWorkRole = {
  name: string;
  description?: string;
  baseRates: resourceRate[];
};

function canAddWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add work roles to the team",
  );
}

export default async function createWorkRole(
  { name, description, baseRates }: NewWorkRole,
  actorMembership: Membership,
) {
  const teamId = actorMembership.teamId;

  canAddWorkRole(actorMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }

  const workRole = await workRoleService.create(
    {
      teamId,
      name,
      description,
      baseRates,
    },
    actorMembership,
  );

  return workRole;
}
