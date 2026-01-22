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
  const newTeam = await teamService.create({
    name,
    ownerId: actorUser.getId(),
  });

  const newMembership = await membershipService.createMembership({
    userId: actorUser.getId(),
    teamId: newTeam.getId(),
    role: "owner",
    name: actorUser.getFullName(),
  });

  actorUser.setActiveMembershipId(newMembership.getId());
  await userService.save(actorUser);

  const membershipAccessToken = newMembership
    ? authService.generateMembershipToken(newMembership)
    : undefined;

  return {
    tokens: {
      membership: { accessToken: membershipAccessToken },
    },
  };
}
