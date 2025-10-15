import { authService, membershipService, userService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type LoginFlowParams = {
  email: string;
  password: string;
  activeMembershipId?: string;
};

export default async function login({
  email,
  password,
  activeMembershipId,
}: LoginFlowParams) {
  const user = await userService.getUserByEmail(email);
  if (!user) throw new BusinessError("INVALID_CREDENTIALS", "User not found");

  const userId = user.getId();

  const isValid = await authService.verifyPassword(user.getId(), password);
  if (!isValid)
    throw new BusinessError("INVALID_CREDENTIALS", "Invalid password");

  const userAccessToken = authService.generateUserToken(user);

  const membership = await membershipService.getActiveUserMembership(userId);

  const membershipAccessToken = membership
    ? authService.generateMembershipToken(membership)
    : undefined;

  return {
    tokens: {
      user: { accessToken: userAccessToken },
      membership: { accessToken: membershipAccessToken },
    },
  };
}
