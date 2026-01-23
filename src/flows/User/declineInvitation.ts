import User from "../../models/User";
import { membershipService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

export default async function declineInvitationFlow(
  { teamId }: { teamId: string },
  actorUser: User,
) {
  const membership = await membershipService.getMembershipByUserAndTeam({
    userId: actorUser.getId(),
    teamId,
  });

  if (!membership) {
    throw new BusinessError("NOT_FOUND", "Membership not found");
  }

  membership.setStatus("declined");
  await membershipService.save(membership);

  return {};
}
