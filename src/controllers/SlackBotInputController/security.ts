import { Request, Response, NextFunction } from "express";
import BussinessError from "../../utils/Rejection";
import log from "../../utils/log";
import { memberships } from "../../services";

const { SLACK_BOT_IN_TOKEN } = process.env;
if (!SLACK_BOT_IN_TOKEN || SLACK_BOT_IN_TOKEN === "") {
  throw new Error("BOT_TOKEN environment variable is not set");
}

export async function checkBot(req: any, res: Response, next: NextFunction) {
  try {
    const { ["x-slack-bot-token"]: botToken } = req.headers;

    if (botToken && botToken === SLACK_BOT_IN_TOKEN) {
      log.info("Authorization with API key");
      const { ["x-slack-user-id"]: userId, ["x-slack-team-id"]: teamId } =
        req.headers;
      const currentUser = await memberships.getMembershipBySlackId(
        userId,
        teamId
      );

      req.data = { currentUser, isBotAction: true };

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
