import { getProjectsFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getProjectsFlow(req.query, actorMembership);
});
