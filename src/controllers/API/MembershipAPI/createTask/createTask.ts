import { createTaskFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return createTaskFlow(req.body, actorMembership);
});
