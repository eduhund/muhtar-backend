import { changeMembershipAccessRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { id } = req.params;
  const { actorMembership } = req.data;
  const { membershipId, accessRole } = req.body;
  await changeMembershipAccessRoleFlow(
    id,
    { membershipId, accessRole },
    actorMembership,
  );
  return {};
});
