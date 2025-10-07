import { authService, users } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type LoginFlowParams = { email: string; password: string };

export default async function login({ email, password }: LoginFlowParams) {
  const user = await users.getUserByEmail(email);
  if (!user) throw new BusinessError("INVALID_CREDENTIALS", "User not found");

  const isValid = await authService.verifyPassword(user.getId(), password);
  if (!isValid)
    throw new BusinessError("INVALID_CREDENTIALS", "Invalid password");

  return authService.generateToken(user);
}
