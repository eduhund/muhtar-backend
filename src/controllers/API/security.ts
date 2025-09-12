import { Request, Response, NextFunction } from "express";
import { checkToken } from "../../utils/tokens";
import { users } from "../../services";
import { errorHandler } from "./responses";
import BussinessError from "../../utils/Rejection";
import log from "../../utils/log";

const { BOT_API_KEY } = process.env;

async function getUserByAccessToken(token: string) {
  const tokenData = checkToken(token);

  if (!tokenData)
    throw new BussinessError("UNAUTHORIZED", "Invalid or expired token");

  const { userId } = tokenData;

  const currentUser = await users.getUserById(userId);
  if (!currentUser) throw new BussinessError("UNAUTHORIZED", "User not found");
}

async function getUserByApiKey(userId: string) {
  if (!userId) {
    throw new BussinessError("UNAUTHORIZED", "User ID not provided");
  }

  const currentUser = await users.getUserById(userId);
  if (!currentUser) throw new BussinessError("UNAUTHORIZED", "User not found");
}

export async function checkAuth(req: any, res: Response, next: NextFunction) {
  try {
    const { authorization, ["x-bot-api-key"]: apiKey } = req.headers;

    if (authorization) {
      log.info("Authorization with access token");
      const token = authorization.replace("Bearer ", "");
      const currentUser = await getUserByAccessToken(token);

      req.data = { currentUser };

      return next();
    }

    if (apiKey && apiKey === BOT_API_KEY) {
      log.info("Authorization with API key");
      const { ["x-slack-user-id"]: userId } = req.headers;
      const currentUser = await getUserByApiKey(userId);

      req.data = { currentUser, isBotAction: true };

      return next();
    }

    throw new BussinessError(
      "UNAUTHORIZED",
      "You not provided a valid access token or API key"
    );
  } catch (e) {
    return next(errorHandler(e));
  }
}
