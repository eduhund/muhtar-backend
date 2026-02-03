import { unbookResourceFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return unbookResourceFlow(req.body, actorMembership);
});
