import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateUpdateProjectMembershipParams(
  req: any,
  res: any,
  next: any
) {
  const { projectId, membershipId, accessRole, workRole, multiplier } =
    req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (!membershipId) throw new InvalidParamsError("membershipId is required");
  if (typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");
  if (accessRole && typeof accessRole !== "string")
    throw new InvalidParamsError("accessRole must be a string");
  if (workRole && typeof workRole !== "string")
    throw new InvalidParamsError("workRole must be a string");
  if (multiplier && typeof multiplier !== "number")
    throw new InvalidParamsError("multiplier must be a number");

  return next();
}
