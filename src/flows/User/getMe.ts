import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import {
  membershipService,
  projectContractService,
  projectPlanService,
  projectService,
  teamService,
} from "../../services";

export default async function getMe(actorUser: User) {
  const userId = actorUser.getId();
  const memberships = await membershipService.getMembershipsByUser(userId);
  const activeMembership = await membershipService.getActiveUserMembership(
    userId
  );
  const activeTeam = activeMembership
    ? await teamService.getTeamById(activeMembership.teamId)
    : null;

  const data: any = {
    ...actorUser.toJSON(),
    memberships: memberships.map((m: Membership) => m.toJSON()),
  };

  if (activeMembership) {
    data.activeMembership = activeMembership.toJSON();
  }

  if (activeTeam) {
    data.activeTeam = activeTeam.toJSON();

    const teamMemberships = await membershipService.getMemberships({
      teamId: activeTeam.getId(),
    });
    data.activeTeam.memberships = teamMemberships.map((m: Membership) =>
      m.toJSON()
    );

    const teamProjects = await projectService.getProjects({
      teamId: activeTeam.getId(),
    });

    data.activeTeam.projects = await Promise.all(
      teamProjects.map(async (p: Project) => {
        const activePlan = p.activePlanId
          ? await projectPlanService.getPlanById(p.activePlanId)
          : null;
        const activeContract = p.activeContractId
          ? await projectContractService.getContractById(p.activeContractId)
          : null;
        return projectService.getRichProject({
          project: p,
          activePlan,
          activeContract,
        });
      })
    );
  }

  delete data.activeMembershipId;

  return data;
}
