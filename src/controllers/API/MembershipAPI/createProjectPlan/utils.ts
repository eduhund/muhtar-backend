import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateCreateProjectPlanParams(
  req: any,
  res: any,
  next: any
) {
  const { projectId } = req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string" && projectId !== null)
    throw new InvalidParamsError("projectId must be a string or null");

  return next();
}
