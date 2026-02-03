import { createProjectContractFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return createProjectContractFlow(req.body, actorMembership);
});
