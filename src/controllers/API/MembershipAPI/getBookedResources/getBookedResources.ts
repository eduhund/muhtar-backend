import { getBookedResourcesFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  return getBookedResourcesFlow(actorMembership);
});
