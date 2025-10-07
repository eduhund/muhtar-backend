import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateChangeTeamParams(
  req: any,
  res: any,
  next: any
) {
  const { teamId } = req.query;
  if (!teamId) {
    throw new InvalidParamsError("teamId is required");
  }
  if (typeof teamId !== "string") {
    throw new InvalidParamsError("teamId must be a string");
  }
  return next();
}
