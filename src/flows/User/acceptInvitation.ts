import User from "../../models/User";
import { authService, membershipService, userService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

export default async function acceptInvitationFlow(
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

  if (membership.isActive()) {
    throw new BusinessError("BAD_REQUEST", "Invitation already accepted");
  }

  membership.setStatus("active");
  await membershipService.save(membership);

  actorUser.setActiveMembershipId(membership.getId());
  await userService.save(actorUser);

  const membershipAccessToken = membership
    ? authService.generateMembershipToken(membership)
    : undefined;

  return {
    tokens: {
      membership: { accessToken: membershipAccessToken },
    },
  };
}
