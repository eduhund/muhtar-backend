import Membership from "../../models/Membership";
import { membershipService } from "../../services";
import { AccessRole } from "../../utils/accessRoles";

type GetMembershipFilters = {
  accessRole?: AccessRole;
  status?: string;
};

export default async function getMemberships(
  { accessRole, status }: GetMembershipFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  if (actorMembership.isMember() || actorMembership.isGuest()) {
    return [actorMembership];
  }

  const membershipList = await membershipService.getMemberships({
    teamId,
    accessRole,
    status,
  });

  if (actorMembership.isManager()) {
    return membershipList.map((membership: Membership) => {
      const maskedMembership = membership.toJSON();
      delete maskedMembership.contract;
      return maskedMembership;
    });
  }

  if (actorMembership.isAdmin()) {
    return membershipList;
  }

  return [];
}
