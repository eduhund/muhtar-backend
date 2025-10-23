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
  withArchived?: boolean;
};

function sortTimetable(timetable: Time[]) {
  return timetable.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return b.ts - a.ts;
  });
}

export default async function getTimetable(
  { projectId, membershipId, date, from, to, withArchived }: GetTimeListParams,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;
  const actorMembershipId = actorMembership.getId();

  let timetable = [];

  // Add Guest access to their own time entries

  const projects = await projectService.getProjectsByTeam(teamId);

  if (actorMembership.isAdmin()) {
    timetable = await timeService.getTimeList({
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
    if (!membershipId || membershipId === actorMembershipId) {
      timetable = await timeService.getTimeList({
        teamId,
        projectId,
        membershipId: actorMembershipId,
        date,
        from,
        to,
        withArchived,
      });
    }

    const membershipProjectList = projects.filter(
      (project: Project) =>
        (projectId ? projectId === project.getId() : true) &&
        (project.isProjectMembership(actorMembershipId) ||
          project.visibility === "team")
    );

    const timePerProject = await Promise.all(
      membershipProjectList.map(async (project: Project) => {
        const thisProjectId = project.getId();
        return await timeService.getTimeList({
          teamId,
          projectId: thisProjectId,
          membershipId,
          date,
          from,
          to,
          withArchived,
        });
      })
    );

    timetable = timePerProject.flat();
  }

  const team = await teamService.getTeamById(teamId);
  const memberships = await membershipService.getMembershipsByTeam(teamId);

  const richTimeList = await Promise.all(
    timetable.map(async (time: Time) => {
      const membership = memberships.find(
        (m: Membership) => m.getId() === time.membershipId
      );
      const project = projects.find(
        (p: Project) => p.getId() === time.projectId
      );
      const richTime = await timeService.getRichTime({
        time,
        membership,
        project,
        team,
        memberships,
      });
      return richTime;
    })
  );

  sortTimetable(richTimeList);

  return richTimeList;
}
