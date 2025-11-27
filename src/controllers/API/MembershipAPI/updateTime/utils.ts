import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateUpdateTimeParams(
  req: any,
  res: any,
  next: any
) {
  const { id, membershipId, projectId, date, duration, comment } = req.body;
  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");
  if (membershipId && typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");
  if (projectId && typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (date && typeof date !== "string")
    throw new InvalidParamsError("date must be a string");
  if (isNaN(new Date(date).getTime()))
    throw new InvalidParamsError("date must be a valid date string");
  if (duration && isNaN(duration))
    throw new InvalidParamsError("duration must be a valid number");
  if (comment && typeof comment !== "string")
    throw new InvalidParamsError("comment must be a string");

  return next();
}
