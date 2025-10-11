import { Request, Response, NextFunction } from "express";
import {
  checkAccessToken,
  checkApiKey,
  getBearerToken,
} from "../../../utils/tokens";
import { membershipService } from "../../../services";
import { BusinessError } from "../../../utils/Rejection";

async function checkToken(token: string) {
  const tokenData = checkAccessToken("membership", token);

  if (tokenData?.membershipId) {
    return tokenData?.membershipId;
  }

  const apiKey = await checkApiKey(token);

  if (apiKey?.membershipId) {
    return apiKey?.membershipId;
  }

  throw new BusinessError("UNAUTHORIZED", "Invalid or expired token");
}

async function getMembershipByToken(token: string) {
  const bearerlessToken = getBearerToken(token);

  if (!bearerlessToken) {
    throw new BusinessError(
      "UNAUTHORIZED",
      "You not provided a valid access token or API key"
    );
  }

  const membershipId = await checkToken(bearerlessToken);
  const currentMembership = await membershipService.getMembershipById(
    membershipId
  );

  if (!currentMembership) {
    throw new BusinessError("UNAUTHORIZED", "Membership not found");
  }

  return currentMembership;
}

export async function checkMembershipAuth(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const actorMembership = await getMembershipByToken(authorization);
    req.data = { actorMembership };
    return next();
  } catch (e) {
    return next(e);
  }
}
