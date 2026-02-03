import { updateWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { id } = req.params;
  const { actorMembership } = req.data;
  const { workRoleName, update } = req.body;
  return updateWorkRoleFlow(id, workRoleName, update, actorMembership);
});
