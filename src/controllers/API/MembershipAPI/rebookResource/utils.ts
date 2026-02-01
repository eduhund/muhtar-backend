import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateRebookResourceParams(
  req: any,
  res: any,
  next: any,
) {
  const { bookedResourceId, value } = req.body;
  if (!bookedResourceId)
    throw new InvalidParamsError("bookedResourceId is required");
  if (typeof bookedResourceId !== "string")
    throw new InvalidParamsError("bookedResourceId must be a string");
  if (typeof value !== "number")
    throw new InvalidParamsError("value must be a number");

  return next();
}
