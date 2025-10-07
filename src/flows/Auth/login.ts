import { authService, memberships, teams, users } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type LoginFlowParams = {
  email: string;
  password: string;
  activeTeamId?: string;
};

export default async function login({
  email,
  password,
  activeTeamId,
}: LoginFlowParams) {
  const user = await users.getUserByEmail(email);
  if (!user) throw new BusinessError("INVALID_CREDENTIALS", "User not found");

  const userId = user.getId();

  const isValid = await authService.verifyPassword(user.getId(), password);
  if (!isValid)
    throw new BusinessError("INVALID_CREDENTIALS", "Invalid password");

  const userAccessToken = authService.generateUserToken(user);

  const teamId =
    activeTeamId ||
    user.getActiveTeam() ||
    (await memberships.getMembershipsByUser(userId))[0]?.teamId ||
    null;
  const membership = teamId
    ? await memberships.getMembership({ userId, teamId })
    : null;

  const team = teamId ? await teams.getTeamById(teamId) : null;

  const membershipAccessToken = membership
    ? authService.generateMembershipToken(membership)
    : undefined;
  const teamAccessToken =
    membership && (membership.isOwner() || membership.isAdmin())
      ? authService.generateTeamToken(membership)
      : undefined;

  return {
    user,
    membership,
    team,
    tokens: {
      user: userAccessToken,
      membership: membershipAccessToken,
      team: teamAccessToken,
    },
  };
}
