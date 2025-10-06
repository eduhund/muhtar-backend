import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetTimeParams(req: any, res: any, next: any) {
  const { id, projectId, membershipId, date, from, to, withDeleted } =
    req.query;
  if (id) {
    if (typeof id !== "string") {
      throw new InvalidParamsError("id must be a string");
    }
    return next();
  } else {
    if (!date && !(from && to)) {
      throw new InvalidParamsError(
        "Either 'date' or both 'from' and 'to' parameters must be provided"
      );
    }
    return next();
  }
}
