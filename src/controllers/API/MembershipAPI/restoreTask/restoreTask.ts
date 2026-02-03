import { restoreTaskFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.body;
  await restoreTaskFlow(id, actorMembership);
  return {};
});
