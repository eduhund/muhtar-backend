import { addWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { workRole } = req.body;
  return addWorkRoleFlow({ workRole }, actorMembership);
});
