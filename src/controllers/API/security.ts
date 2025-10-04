import { Request, Response, NextFunction } from "express";
import { checkAccessToken, getBearerToken } from "../../utils/tokens";
import { users } from "../../services";
import BussinessError from "../../utils/Rejection";

async function getUserByAccessToken(token: string) {
  const tokenData = checkAccessToken(token);

  if (!tokenData)
    throw new BussinessError("UNAUTHORIZED", "Invalid or expired token");

  const { userId } = tokenData;

  const currentUser = await users.getUserById(userId);
  if (!currentUser) throw new BussinessError("UNAUTHORIZED", "User not found");
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
    const currentUser = await getUserByAccessToken(token);

    req.data = { currentUser };

    return next();
  } catch (e) {
    return next();
  }
}
