import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetProjectsParams(
  req: any,
  res: any,
  next: any
) {
  const { id, membershipId } = req.query;
  if (id) {
    if (typeof id !== "string") {
      throw new InvalidParamsError("id must be a string");
    }
    return next();
  } else {
    if (membershipId && typeof membershipId !== "string")
      throw new InvalidParamsError("membershipId must be a string");
    return next();
  }
}
