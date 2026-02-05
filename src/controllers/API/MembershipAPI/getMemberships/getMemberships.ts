import { getTeamMembershipsFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  // TODO: validate params if any in future
  return getTeamMembershipsFlow(req.query, actorMembership);
});
