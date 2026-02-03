import { getTasksFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getTasksFlow(req.query, actorMembership);
});
