import { addWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { id } = req.params;
  const { actorMembership } = req.data;
  const { workRole } = req.body;
  return addWorkRoleFlow(id, workRole, actorMembership);
});
