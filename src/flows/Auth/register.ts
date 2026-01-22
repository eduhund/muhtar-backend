import { authService, userService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type RegisterFlowParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default async function registerFlow({
  email,
  password,
  firstName,
  lastName,
}: RegisterFlowParams) {
  const isEmailUsed = await userService.isEmailUsed(email);
  if (isEmailUsed) {
    throw new BusinessError("INVALID_CREDENTIALS", "Email already exists");
  }

  const user = await userService.create({
    email,
    password,
    firstName,
    lastName,
  });

  const userAccessToken = authService.generateUserToken(user);

  return {
    tokens: {
      user: { accessToken: userAccessToken },
    },
  };
}
