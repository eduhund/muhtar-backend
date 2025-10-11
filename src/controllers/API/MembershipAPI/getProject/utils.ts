import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetProjectsParams(
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
