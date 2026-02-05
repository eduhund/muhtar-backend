import { removeProjectMembershipFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, membershipId } = req.body;

  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");

  if (!membershipId) throw new InvalidParamsError("membershipId is required");
  if (typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");

  return removeProjectMembershipFlow(projectId, membershipId, actorMembership);
});
