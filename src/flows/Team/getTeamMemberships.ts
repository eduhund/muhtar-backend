import Membership from "../../models/Membership";
import { membershipService } from "../../services";

type GetMembershipFilters = {
  accessRole?: string;
  status?: string;
};

export default async function getMemberships(
  { accessRole, status }: GetMembershipFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const membershipList = await membershipService.getMemberships({
    teamId,
    accessRole,
    status,
  });

  return membershipList;
}
