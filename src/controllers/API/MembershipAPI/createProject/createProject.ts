import { createProjectFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return createProjectFlow(req.body, actorMembership);
});
