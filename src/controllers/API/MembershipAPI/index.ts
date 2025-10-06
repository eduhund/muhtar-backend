import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import addTime from "./addTime";
import {
  checkAccessToken,
  checkApiKey,
  getBearerToken,
} from "../../../utils/tokens";
import { memberships } from "../../../services";
import BussinessError from "../../../utils/Rejection";
import getProjects from "./getProjects";
import getTimeList from "./getTimeList";

async function checkToken(token: string) {
  const tokenData = checkAccessToken(token);

  if (tokenData?.membershipId) {
    return tokenData?.membershipId;
  }

  const apiKey = await checkApiKey(token);

  if (apiKey?.membershipId) {
    return apiKey?.membershipId;
  }

  throw new BussinessError("UNAUTHORIZED", "Invalid or expired token");
}

async function getMembershipByToken(token: string) {
  const bearerlessToken = getBearerToken(token);

  if (!bearerlessToken) {
    throw new BussinessError(
      "UNAUTHORIZED",
      "You not provided a valid access token or API key"
    );
  }

  const membershipId = await checkToken(bearerlessToken);
  const currentMembership = await memberships.getMembershipById(membershipId);

  if (!currentMembership) {
    throw new BussinessError("UNAUTHORIZED", "Membership not found");
  }

  return currentMembership;
}

async function checkMembershipAuth(
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

const membershipApiRouter = Router();

membershipApiRouter.use(checkMembershipAuth);
membershipApiRouter.get("/getProjects", getProjects);
membershipApiRouter.get("/getTimeList", getTimeList);
membershipApiRouter.post("/addTime", addTime);

export default membershipApiRouter;
