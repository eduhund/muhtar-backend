import { getTasksFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, assignedMembershipId } = req.query;

  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");

  if (assignedMembershipId && typeof assignedMembershipId !== "string")
    throw new InvalidParamsError("assignedMembershipId must be a string");

  return getTasksFlow({ projectId, assignedMembershipId }, actorMembership);
});
