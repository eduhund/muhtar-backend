import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateUnbookResourceParams(
  req: any,
  res: any,
  next: any,
) {
  const { bookedResourceId } = req.body;
  if (!bookedResourceId)
    throw new InvalidParamsError("bookedResourceId is required");
  if (typeof bookedResourceId !== "string")
    throw new InvalidParamsError("bookedResourceId must be a string");

  return next();
}
