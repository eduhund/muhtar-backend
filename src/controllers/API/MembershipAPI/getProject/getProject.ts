import { getProjectFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getProjectFlow(req.query, actorMembership);
});
