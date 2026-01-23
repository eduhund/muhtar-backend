import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateDeclineInvitationParams(
  req: any,
  res: any,
  next: any,
) {
  const { teamId } = req.body;
  if (!teamId) {
    throw new InvalidParamsError("teamId is required");
  }
  if (typeof teamId !== "string") {
    throw new InvalidParamsError("teamId must be a string");
  }
  return next();
}
