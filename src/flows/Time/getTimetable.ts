import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import {
  projectService,
  timeService,
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

  let timetable: Time[] = [];

  // Add Guest access to their own time entries

  const projects = (await projectService.getProjectsByTeam(
    teamId
  )) as Project[];

  const tasks = await taskService.getTasksByTeam(teamId);

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
    timetable = await timeService.getTimeList({
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
        const projectTime = await timeService.getTimeList({
          teamId,
          projectId: project.getId(),
          membershipId,
          date,
          from,
          to,
          withArchived,
        });
        const projectTimeExceptActorTime = projectTime.filter((time: Time) => {
          return time.membershipId !== actorMembershipId;
        });
        timetable = timetable.concat(projectTimeExceptActorTime);
      }
    }
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
