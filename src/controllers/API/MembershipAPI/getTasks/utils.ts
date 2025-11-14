import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetTasksParams(req: any, res: any, next: any) {
  const { projectId, assignedMembershipId } = req.query;
  if (projectId && typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (assignedMembershipId && typeof assignedMembershipId !== "string")
    throw new InvalidParamsError("assignedMembershipId must be a string");
  return next();
}
