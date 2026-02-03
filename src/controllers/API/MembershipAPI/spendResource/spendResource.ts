import { spendResourceFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return spendResourceFlow(req.body, actorMembership);
});
