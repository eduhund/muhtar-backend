import { Request, Response, NextFunction } from "express";
import { checkToken } from "../../utils/tokens";
import { users } from "../../services";
import { errorHandler } from "./responses";
import BussinessError from "../../utils/Rejection";
import log from "../../utils/log";

async function getUserByAccessToken(token: string) {
  const tokenData = checkToken(token);

  if (!tokenData)
    throw new BussinessError("UNAUTHORIZED", "Invalid or expired token");

  const { userId } = tokenData;

  const currentUser = await users.getUserById(userId);
  if (!currentUser) throw new BussinessError("UNAUTHORIZED", "User not found");
}

export async function checkAuth(req: any, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      log.info("Authorization with access token");
      const token = authorization.replace("Bearer ", "");
      const currentUser = await getUserByAccessToken(token);

      req.data = { currentUser };

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
