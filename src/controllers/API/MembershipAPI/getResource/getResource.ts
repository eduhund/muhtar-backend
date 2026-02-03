import { getResourceFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getResourceFlow(req.query, actorMembership);
});
