import { Request, Response, NextFunction } from "express";
import {
  checkAccessToken,
  checkApiKey,
  getBearerToken,
} from "../../utils/tokens";
import { memberships, users } from "../../services";
import BussinessError from "../../utils/Rejection";

async function getUserByToken(token: string) {
  const tokenData = checkAccessToken(token);

  let currentUser = null;

  if (tokenData) {
    const { userId } = tokenData;
    currentUser = await users.getUserById(userId);
  }

  const apiKey = await checkApiKey(token);

  if (apiKey) {
    if (apiKey.userId) {
      currentUser = await users.getUserById(apiKey.userId);
    } else if (apiKey.membershipId) {
      const currentMembership = await memberships.getMembershipById(
        apiKey.membershipId
      );
      if (currentMembership) {
        currentUser = await users.getUserById(currentMembership.userId);
      }
    }
  }

  if (currentUser) return currentUser;

  throw new BussinessError("UNAUTHORIZED", "Invalid or expired token");
}

export async function checkUserAuth(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    const token = getBearerToken(authorization);
    if (!token) {
      throw new BussinessError(
        "UNAUTHORIZED",
        "You not provided a valid access token or API key"
      );
    }
    const actorUser = await getUserByToken(token);

    if (!actorUser) {
      throw new BussinessError("UNAUTHORIZED", "User not found");
    }

    req.data = { actorUser };

    return next();
  } catch (e) {
    return next();
  }
}
