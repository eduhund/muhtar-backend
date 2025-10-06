import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetTimeListParams(
  req: any,
  res: any,
  next: any
) {
  const { projectId, membershipId, date, from, to, withDeleted } = req.query;
  if (!date && !(from && to)) {
    throw new InvalidParamsError(
      "Either 'date' or both 'from' and 'to' parameters must be provided"
    );
  }

  return next();
}
