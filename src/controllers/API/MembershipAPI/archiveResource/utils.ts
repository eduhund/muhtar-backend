import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateArchiveResourceParams(
  req: any,
  res: any,
  next: any
) {
  const { id } = req.body;
  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");

  return next();
}
