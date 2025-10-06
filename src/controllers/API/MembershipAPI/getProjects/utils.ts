import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetProjectsParams(
  req: any,
  res: any,
  next: any
) {
  const { membershipId } = req.query;
  if (membershipId && typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");

  return next();
}
