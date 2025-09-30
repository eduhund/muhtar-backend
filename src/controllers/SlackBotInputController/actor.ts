import { Request, Response, NextFunction } from "express";
import BussinessError from "../../utils/Rejection";
import { memberships } from "../../services";

export async function checkActor(req: any, res: Response, next: NextFunction) {
  try {
    const { membershipId } = req.body;
    const currentUser = await memberships.getUserByMembershipId(membershipId);
    if (!currentUser) {
      throw new BussinessError("FORBIDDEN", "User not found");
    }
    req.data = { currentUser };
    return next();
  } catch (e) {
    return res.status(401).send({ OK: false, error: "Unauthorized" });
  }
}
