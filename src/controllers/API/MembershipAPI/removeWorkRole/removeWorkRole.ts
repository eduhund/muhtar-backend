import { removeWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { id } = req.params;
  const { actorMembership } = req.data;
  const { workRoleName } = req.body;
  return removeWorkRoleFlow(id, workRoleName, actorMembership);
});
