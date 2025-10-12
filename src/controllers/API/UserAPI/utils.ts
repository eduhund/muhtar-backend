import { Request, Response, NextFunction } from "express";
import {
  checkAccessToken,
  checkApiKey,
  getBearerToken,
} from "../../../utils/tokens";
import { userService } from "../../../services";
import { BusinessError } from "../../../utils/Rejection";

async function checkToken(token: string) {
  const tokenData = checkAccessToken("user", token);

  if (tokenData?.userId) {
    return tokenData?.userId;
  }

  const apiKey = await checkApiKey(token);

  if (apiKey?.userId) {
    return apiKey?.userId;
  }

  throw new BusinessError("UNAUTHORIZED", "Invalid or expired token");
}

async function getUserByToken(token: string) {
  const bearerlessToken = getBearerToken(token);

  if (!bearerlessToken) {
    throw new BusinessError(
      "UNAUTHORIZED",
      "You not provided a valid access token or API key"
    );
  }

  const userId = await checkToken(bearerlessToken);
  const currentUser = await userService.getUserById(userId);

  if (!currentUser) {
    throw new BusinessError("NOT_FOUND", "User not found");
  }

  return currentUser;
}

export async function checkUserAuth(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const actorUser = await getUserByToken(authorization);
    req.data = { actorUser };
    return next();
  } catch (e) {
    return next(e);
  }
}
