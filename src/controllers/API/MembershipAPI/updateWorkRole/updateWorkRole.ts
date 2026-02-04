import { updateWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id, workRoleName, update } = req.body;
  //TODO: validate params
  return updateWorkRoleFlow(id, workRoleName, update, actorMembership);
});
