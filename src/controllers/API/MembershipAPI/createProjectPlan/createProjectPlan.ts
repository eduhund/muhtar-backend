import { createProjectPlanFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return createProjectPlanFlow(req.body, actorMembership);
});
