import { authService, users } from "../../services";

type LoginFlowParams = { email: string; password: string };

export default async function login({ email, password }: LoginFlowParams) {
  const user = await users.getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const isValid = await authService.verifyPassword(user.getId(), password);
  if (!isValid) throw new Error("Invalid password");

  return await authService.generateToken(user);
}
