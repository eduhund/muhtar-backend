import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateGetTasksParams(req: any, res: any, next: any) {
  const { assignedProjectId, assignedMembershipId } = req.query;
  if (assignedProjectId && typeof assignedProjectId !== "string")
    throw new InvalidParamsError("assignedProjectId must be a string");
  if (assignedMembershipId && typeof assignedMembershipId !== "string")
    throw new InvalidParamsError("assignedMembershipId must be a string");
  return next();
}
