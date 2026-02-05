import { removeMembershipFromTeamFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { membershipId } = req.body;
  //TODO: validate membershipId
  await removeMembershipFromTeamFlow({ membershipId }, actorMembership);
  return {};
});
