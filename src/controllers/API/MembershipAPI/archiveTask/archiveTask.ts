import { archiveTaskFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.body;
  await archiveTaskFlow(id, actorMembership);
  return {};
});
