import User from "../../models/User";
import {
  authService,
  membershipService,
  teamService,
  userService,
} from "../../services";

export default async function createTeamFlow(
  { name }: { name: string },
  actorUser: User,
) {
  const team = await teamService.create({
    name,
    ownerId: actorUser.getId(),
  });

  const membership = await membershipService.createMembership({
    userId: actorUser.getId(),
    teamId: team.getId(),
    role: "admin",
    name,
  });

  actorUser.setActiveMembershipId(membership.getId());
  await userService.save(actorUser);

  const membershipAccessToken = membership
    ? authService.generateMembershipToken(membership)
    : undefined;

  return {
    membership,
    team,
    tokens: {
      membership: { accessToken: membershipAccessToken },
    },
  };
}
