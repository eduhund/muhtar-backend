import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetResourceParams(
  req: any,
  res: any,
  next: any
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    throw new InvalidParamsError("id must be a string");
  }
  return next();
}
