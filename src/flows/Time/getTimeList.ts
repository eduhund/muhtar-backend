import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import User from "../../models/User";
import { projects, time, teams, memberships } from "../../services";
import { getRichTime } from "../../utils/getRichObject";
import BussinessError from "../../utils/Rejection";

type GetTimeListParams = {
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  withDeleted?: boolean;
};

type TimeListQuery = GetTimeListParams & { teamId: string };

function canGetTeamTime(actorMembership: Membership) {
  return actorMembership.isOwner() || actorMembership.isAdmin();
}

function buildQuery({
  teamId,
  projectId,
  membershipId,
  date,
  from,
  to,
  withDeleted,
}: TimeListQuery): Partial<TimeListQuery> {
  const query: Partial<TimeListQuery> = {
    teamId,
    withDeleted: withDeleted || false,
  };
  if (projectId) query.projectId = projectId;
  if (membershipId) query.membershipId = membershipId;
  if (date) {
    query.date = date;
  } else {
    if (from) query.from = from;
    if (to) query.to = to;
  }
  return query;
}

export default async function getTimeList(
  { projectId, membershipId, from, to, withDeleted }: GetTimeListParams,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;
  const currentMembershipId = actorMembership.getId();

  let timeList = [];

  if (canGetTeamTime(actorMembership)) {
    timeList = await time.getTime(
      buildQuery({ teamId, projectId, membershipId, from, to, withDeleted })
    );
  } else {
    const currentMembershipProjectList =
      await projects.getProjectsByMembershipId(currentMembershipId);
    const timePerProject = await Promise.all(
      currentMembershipProjectList.map(async (project: Project) => {
        const thisProjectId = project.getId();
        if (thisProjectId !== projectId) return [];

        const projectRole =
          project.getProjectMembershipRole(currentMembershipId);

        if (projectRole === "manager") {
          return await time.getTime(
            buildQuery({
              teamId,
              projectId: thisProjectId,
              membershipId,
              from,
              to,
              withDeleted,
            })
          );
        } else if (projectRole === "user") {
          return await time.getTime({
            thisProjectId,
            membershipId: currentMembershipId,
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
