import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateRemoveProjectMembershipParams(
  req: any,
  res: any,
  next: any
) {
  const { projectId, membershipId } = req.body;
  req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (!membershipId) throw new InvalidParamsError("membershipId is required");
  if (typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");

  return next();
}
