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

  if (actorMembership.isGuest()) {
    if (membershipId && membershipId !== actorMembershipId) {
      throw new Error("Guests can only access their own timetable");
    }

    if (projectId) {
      const project = await projectService.getProjectById(projectId);
      if (!project) throw new Error("Project not found");

      if (!project.isProjectMembership(actorMembershipId))
        throw new Error("Access denied to this project");

      const projectRole = project.getProjectMembershipRole(actorMembershipId);
      if (projectRole === "admin" || projectRole === "user") {
        timeService.getTimeList({
          teamId,
          projectId,
          membershipId,
          date,
          from,
          to,
        });
      } else {
        timeService.getTimeList({
          teamId,
          projectId,
          membershipId: actorMembershipId,
          date,
          from,
          to,
        });
      }
    }
  }

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
  } else {
    const currentMembershipProjectList =
      await projectService.getProjectsByMembershipId(actorMembershipId);

    const timePerProject = await Promise.all(
      currentMembershipProjectList.map(async (project: Project) => {
        const thisProjectId = project.getId();
        if (projectId && projectId !== thisProjectId) return [];

        const projectRole = project.getProjectMembershipRole(actorMembershipId);

        if (projectRole === "admin") {
          return await timeService.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId,
            date,
            from,
            to,
            withArchived,
          });
        } else {
          return await timeService.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId: actorMembershipId,
          });
        }
      })
    );

    timetable = timePerProject.flat();
  }

  const team = await teamService.getTeamById(teamId);
  const projects = await projectService.getProjectsByTeam(teamId);
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
