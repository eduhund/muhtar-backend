import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import {
  projectService,
  timeService,
  teamService,
  membershipService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type GetTimeParams = {
  id: string;
};

function canGetTime(
  currentMembership: Membership,
  project: Project,
  timeEntry: Time
) {
  if (currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectAdmin(currentMembershipId)) return true;

  if (timeEntry.membershipId === currentMembershipId) return true;
  return false;
}

export default async function getTime(
  { id }: GetTimeParams,
  actorMembership: Membership
) {
  const timeData = await timeService.getTimeById(id);

  if (!timeData) {
    throw new BusinessError("NOT_FOUND", "Time entry not found");
  }

  const { teamId, projectId, membershipId } = timeData;

  const membership = await membershipService.getMembershipById(membershipId);

  if (!membership) {
    throw new BusinessError("INTERNAL_ERROR", "Membership not found");
  }

  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new BusinessError("INTERNAL_ERROR", "Project not found");
  }
  const team = await teamService.getTeamById(teamId);
  if (!team) {
    throw new BusinessError("INTERNAL_ERROR", "Team not found");
  }

  const memberships = await membershipService.getMembershipsByTeam(teamId);

  if (!canGetTime(actorMembership, project, timeData)) {
    throw new BusinessError(
      "FORBIDDEN",
      "You do not have access to this time entry"
    );
  }

  return await timeService.getRichTime({
    time: timeData,
    membership,
    project,
    team,
    memberships,
  });
}
