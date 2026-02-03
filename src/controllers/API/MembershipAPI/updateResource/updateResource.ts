import { updateResourceFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.body;
  await updateResourceFlow(id, req.body, actorMembership);
  return {};
});
