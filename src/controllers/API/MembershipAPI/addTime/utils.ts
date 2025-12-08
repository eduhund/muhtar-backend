import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateAddTimeParams(req: any, res: any, next: any) {
  const { membershipId, projectId, date, target, duration, comment } = req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (!date) req.body.date = dateOnlyIsoString(new Date());
  if (typeof date !== "string")
    throw new InvalidParamsError("date must be a string");
  if (isNaN(new Date(date).getTime()))
    throw new InvalidParamsError("date must be a valid date string");
  if (target !== null && typeof target !== "object")
    throw new InvalidParamsError("target must be an object or null");
  if (!duration) throw new InvalidParamsError("duration is required");
  if (isNaN(duration))
    throw new InvalidParamsError("duration must be a valid number");
  if (duration <= 0)
    throw new InvalidParamsError("duration must be greater than 0");
  if (comment && typeof comment !== "string")
    throw new InvalidParamsError("comment must be a string");
  if (membershipId && typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");

  return next();
}
