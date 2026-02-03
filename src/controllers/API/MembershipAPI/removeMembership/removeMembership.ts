import { removeMembershipFromTeamFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { id } = req.params;
  const { actorMembership } = req.data;
  const { membershipId } = req.body;
  await removeMembershipFromTeamFlow(id, membershipId, actorMembership);
  return {};
});
