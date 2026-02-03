import { getResourcesFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getResourcesFlow(req.query, actorMembership);
});
