import User from "../../../../models/User";
import { memberships } from "../../../../services";
import { BusinessError } from "../../../../utils/Rejection";

export default async function changeTeam(
  { teamId }: { teamId: string },
  actorUser: User
) {
  const userId = actorUser.getId();
  const membership = await memberships.getMembership({
    teamId,
    userId,
  });
  if (!membership) {
    throw new BusinessError("NOT_FOUND", "You are not a member of this team");
  }
  await actorUser.setActiveTeam(teamId);
}
