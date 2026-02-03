import { addProjectMembershipFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, membershipId, accessRole, workRole, multiplier } =
    req.body;
  return addProjectMembershipFlow(
    projectId,
    { membershipId, accessRole, workRole, multiplier },
    actorMembership,
  );
});
