import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateRebookResourceParams(
  req: any,
  res: any,
  next: any,
) {
  const { id, value } = req.body;
  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");
  if (typeof value !== "number")
    throw new InvalidParamsError("value must be a number");

  return next();
}
