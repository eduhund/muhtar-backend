import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Resource from "../../models/Resource";
import {
  projectService,
  resourceService,
  teamService,
  membershipService,
  taskService,
} from "../../services";

type GetTimeListParams = {
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  withArchived?: boolean;
};

function sortResources(resources: Resource[]) {
  return resources.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return b.ts - a.ts;
  });
}

export default async function getResources(
  { projectId, membershipId, date, from, to, withArchived }: GetTimeListParams,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;
  const actorMembershipId = actorMembership.getId();

  let resources: Resource[] = [];

  // Add Guest access to their own time entries

  const projects = (await projectService.getProjectsByTeam(
    teamId
  )) as Project[];

  const tasks = await taskService.getTasksByTeam(teamId);

  if (actorMembership.isAdmin()) {
    resources = await resourceService.getResourceList({
      teamId,
      projectId,
      membershipId,
      date,
      from,
      to,
      withArchived,
    });
  }

  if (actorMembership.isMember()) {
    resources = await resourceService.getResourceList({
      teamId,
      projectId,
      membershipId: actorMembershipId,
      date,
      from,
      to,
      withArchived,
    });

    for (const project of projects) {
      if (project.isProjectAdmin(actorMembershipId)) {
        const projectTime = await resourceService.getResourceList({
          teamId,
          projectId: project.getId(),
          membershipId,
          date,
          from,
          to,
          withArchived,
        });
        const projectTimeExceptActorTime = projectTime.filter(
          (resource: Resource) => {
            return resource.membershipId !== actorMembershipId;
          }
        );
        resources = resources.concat(projectTimeExceptActorTime);
      }
    }
  }

  const team = await teamService.getTeamById(teamId);
  const memberships = await membershipService.getMembershipsByTeam(teamId);

  const richResourceList = await Promise.all(
    resources.map(async (resource: Resource) => {
      const membership = memberships.find(
        (m: Membership) => m.getId() === resource.membershipId
      );
      const project = projects.find(
        (p: Project) => p.getId() === resource.projectId
      );

      const richResource = await resourceService.getRichResource({
        resource,
        membership,
        project,
        team,
        memberships,
      });
      return richResource;
    })
  );

  sortResources(richResourceList);
  return richResourceList;
}
