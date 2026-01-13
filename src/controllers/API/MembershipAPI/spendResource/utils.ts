import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateSpendResourceParams(
  req: any,
  res: any,
  next: any
) {
  const { membershipId, projectId, date, target, consumed, comment } = req.body;
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
  if (!consumed) throw new InvalidParamsError("consumed is required");
  if (isNaN(consumed))
    throw new InvalidParamsError("consumed must be a valid number");
  if (consumed <= 0)
    throw new InvalidParamsError("consumed must be greater than 0");
  if (comment && typeof comment !== "string")
    throw new InvalidParamsError("comment must be a string");
  if (membershipId && typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");

  return next();
}
