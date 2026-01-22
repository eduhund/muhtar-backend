import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateCreateTeamParams(
  req: any,
  res: any,
  next: any,
) {
  const { name } = req.body;
  if (!name) {
    throw new InvalidParamsError("name is required");
  }
  if (typeof name !== "string") {
    throw new InvalidParamsError("name must be a string");
  }
  return next();
}
