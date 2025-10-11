import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import {
  projectService,
  timeService,
  teamService,
  membershipService,
} from "../../services";

type GetTimeListParams = {
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  withDeleted?: boolean;
};

export default async function getTimetable(
  { projectId, membershipId, date, from, to, withDeleted }: GetTimeListParams,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;
  const actorMembershipId = actorMembership.getId();

  let timetable = [];

  if (actorMembership.isOwner() || actorMembership.isAdmin()) {
    timetable = await timeService.getTimeList({
      teamId,
      projectId,
      membershipId,
      date,
      from,
      to,
      withDeleted,
    });
  } else {
    const currentMembershipProjectList =
      await projectService.getProjectsByMembershipId(actorMembershipId);
    const timePerProject = await Promise.all(
      currentMembershipProjectList.map(async (project: Project) => {
        const thisProjectId = project.getId();
        if (thisProjectId !== projectId) return [];

        const projectRole = project.getProjectMembershipRole(actorMembershipId);

        if (projectRole === "manager") {
          return await timeService.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId,
            date,
            from,
            to,
            withDeleted,
          });
        } else if (projectRole === "user") {
          return await timeService.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId: actorMembershipId,
          });
        } else {
          return [];
        }
      })
    );

    timetable = timePerProject.flat().sort((a, b) => a.ts - b.ts);
  }

  const team = await teamService.getTeamById(teamId);
  const teamProjects = await projectService.getProjectsByTeam(teamId);
  const teamMemberships = await membershipService.getMembershipsByTeam(teamId);

  const richTimeList = await Promise.all(
    timetable.map(async (time: Time) => {
      const membership = teamMemberships.find(
        (m: Membership) => m.getId() === time.membershipId
      );
      const project = teamProjects.find(
        (p: Project) => p.getId() === time.projectId
      );
      const richTime = await timeService.getRichTime({
        time,
        membership,
        project,
        team,
        teamMemberships,
      });
      return richTime;
    })
  );

  return richTimeList;
}
