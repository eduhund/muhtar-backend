import { workRoleService } from "../../services";
import Membership from "../../models/Membership";
import { BusinessError } from "../../utils/Rejection";
import WorkRole from "../../models/WorkRole";

function canUpdateWorkRole(currentMembership: Membership) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update work roles in the team",
  );
}

export default async function updateWorkRole(
  id: string,
  newData: Partial<WorkRole>,
  actorMembership: Membership,
) {
  const teamId = actorMembership.teamId;

  canUpdateWorkRole(actorMembership);

  const workRole = await workRoleService.getWorkRoleById(id);

  if (!workRole) {
    throw new BusinessError("NOT_FOUND", "Work role not found");
  }
  if (workRole.teamId !== teamId) {
    throw new BusinessError("FORBIDDEN", "Work role does not belong to team");
  }

  workRole.update(newData, actorMembership);
  await workRoleService.save(workRole);

  return workRole;
}
