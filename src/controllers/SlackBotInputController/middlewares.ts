import { Request, Response, NextFunction } from "express";
import BussinessError from "../../utils/Rejection";
import { getBearerToken } from "../../utils/tokens";
import { memberships } from "../../services";

const { SLACK_BOT_IN_TOKEN } = process.env;
if (!SLACK_BOT_IN_TOKEN || SLACK_BOT_IN_TOKEN === "") {
  throw new Error("BOT_TOKEN environment variable is not set");
}

export async function checkBot(req: any, res: Response, next: NextFunction) {
  try {
    const botToken = getBearerToken(req.headers["authorization"]);

    if (botToken && botToken === SLACK_BOT_IN_TOKEN) {
      req.data = { isBotAction: true };
      return next();
    }

    throw new BussinessError(
      "UNAUTHORIZED",
      "You not provided a valid access token or API key"
    );
  } catch (e) {
    return res.status(401).send({ OK: false, error: "Unauthorized" });
  }
}

export async function checkActor(req: any, res: Response, next: NextFunction) {
  try {
    const { membershipId } = req.body;
    const actorUser = await memberships.getUserByMembershipId(membershipId);
    if (!actorUser) {
      throw new BussinessError("FORBIDDEN", "User not found");
    }
    req.data = { actorUser };
    return next();
  } catch (e) {
    return res.status(401).send({ OK: false, error: "Unauthorized" });
  }
}
