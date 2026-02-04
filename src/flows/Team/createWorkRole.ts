import { teamService, workRoleService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";

export type NewWorkRole = {
  name: string;
  description?: string;
  baseRate: {
    currency: string;
    amount: number;
  };
};

function canAddWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to add work roles to the team",
  );
}

export default async function createWorkRole(
  { name, description, baseRate }: NewWorkRole,
  actorMembership: Membership,
) {
  const teamId = actorMembership.teamId;

  canAddWorkRole(actorMembership);

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("NOT_FOUND", `Team not found`);
  }

  await workRoleService.create(
    {
      teamId,
      name,
      description,
      baseRate,
    },
    actorMembership,
  );

  return {};
}
