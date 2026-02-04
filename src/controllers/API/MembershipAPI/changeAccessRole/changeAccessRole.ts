import { changeMembershipAccessRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { membershipId, accessRole } = req.body;

  await changeMembershipAccessRoleFlow(
    { membershipId, accessRole },
    actorMembership,
  );
  return {};
});
