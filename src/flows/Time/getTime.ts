import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { projects, time, teams, memberships } from "../../services";
import { getRichTime } from "../../utils/getRichObject";
import { BusinessError } from "../../utils/Rejection";

type GetTimeParams = {
  id: string;
};

function canGetTime(
  currentMembership: Membership,
  project: Project,
  timeEntry: Time
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (
    currentMembership.isManager() &&
    project.isProjectMembership(currentMembershipId)
  )
    return true;

  if (timeEntry.membershipId === currentMembershipId) return true;
  return false;
}

export default async function getTime(
  { id }: GetTimeParams,
  actorMembership: Membership
) {
  const timeData = await time.getTimeById(id);

  if (!timeData) {
    throw new BusinessError("NOT_FOUND", "Time entry not found");
  }

  const { teamId, projectId, membershipId } = timeData;

  const project = await projects.getProjectById(projectId);
  if (!project) {
    throw new BusinessError("INTERNAL_ERROR", "Project not found");
  }
  const team = await teams.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("INTERNAL_ERROR", "Team not found");
  }

  if (!canGetTime(actorMembership, project, timeData)) {
    throw new BusinessError(
      "FORBIDDEN",
      "You do not have access to this time entry"
    );
  }

  return getRichTime({
    time: timeData,
    membership: actorMembership,
    project,
    team,
  });
}
