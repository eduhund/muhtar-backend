import { getTeamMembershipsFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getTeamMembershipsFlow(req.query, actorMembership);
});
