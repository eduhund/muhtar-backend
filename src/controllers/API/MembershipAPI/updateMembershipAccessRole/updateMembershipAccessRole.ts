import { updateMembershipAccessRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { membershipId, accessRole } = req.body;

  await updateMembershipAccessRoleFlow(
    { membershipId, accessRole },
    actorMembership,
  );
  return {};
});
