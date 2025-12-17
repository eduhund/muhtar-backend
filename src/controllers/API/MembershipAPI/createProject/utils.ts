import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateCreateProjectParams(
  req: any,
  res: any,
  next: any
) {
  const { name, description } = req.body;
  if (!name) throw new InvalidParamsError("name is required");
  if (typeof name !== "string")
    throw new InvalidParamsError("name must be a string");

  if (description && typeof description !== "string")
    throw new InvalidParamsError("description must be a string");

  return next();
}
