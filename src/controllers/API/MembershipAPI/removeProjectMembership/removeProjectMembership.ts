import { removeProjectMembershipFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, membershipId } = req.body;
  return removeProjectMembershipFlow(projectId, membershipId, actorMembership);
});
