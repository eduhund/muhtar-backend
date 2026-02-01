import Membership from "../../models/Membership";
import { bookedResourceService } from "../../services";

export default async function getBookedResources(actorMembership: Membership) {
  const { teamId } = actorMembership;

  const bookedResources =
    bookedResourceService.getBookedResourcesByTeam(teamId);

  return bookedResources;
}
