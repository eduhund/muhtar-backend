import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { projects, time, teams, memberships } from "../../services";
import { getRichTime } from "../../utils/getRichObject";

type GetTimeListParams = {
  id?: string;
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  withDeleted?: boolean;
};

export default async function getTimeList(
  {
    id,
    projectId,
    membershipId,
    date,
    from,
    to,
    withDeleted,
  }: GetTimeListParams,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;
  const actorMembershipId = actorMembership.getId();

  let timeList = [];

  if (actorMembership.isOwner() || actorMembership.isAdmin()) {
    timeList = await time.getTimeList({
      id,
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
      await projects.getProjectsByMembershipId(actorMembershipId);
    const timePerProject = await Promise.all(
      currentMembershipProjectList.map(async (project: Project) => {
        const thisProjectId = project.getId();
        if (thisProjectId !== projectId) return [];

        const projectRole = project.getProjectMembershipRole(actorMembershipId);

        if (projectRole === "manager") {
          return await time.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId,
            date,
            from,
            to,
            withDeleted,
          });
        } else if (projectRole === "user") {
          return await time.getTimeList({
            teamId,
            projectId: thisProjectId,
            membershipId: actorMembershipId,
          });
        } else {
          return [];
        }
      })
    );

    timeList = timePerProject.flat().sort((a, b) => a.ts - b.ts);
  }

  const membershipList = await memberships.getMembershipsByTeam(teamId);
  const projectList = await projects.getProjectsByTeam(teamId);
  const team = await teams.getTeamById(teamId);

  const richTimeList = await Promise.all(
    timeList.map(async (time: Time) => {
      const membership = membershipList.find(
        (m: Membership) => m.getId() === time.membershipId
      );
      const project = projectList.find(
        (p: Project) => p.getId() === time.projectId
      );
      const richTime = await getRichTime({
        time,
        membership,
        project,
        team,
      });
      return richTime;
    })
  );

  return richTimeList;
}
