import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time, { ResourceTarget } from "../../models/Time";
import {
  membershipService,
  projectService,
  teamService,
  timeService,
} from "../../services";
import { dateOnlyIsoString } from "../../utils/date";
import { BusinessError } from "../../utils/Rejection";

type updateTimeParams = {
  membershipId?: string;
  projectId?: string;
  date?: Date;
  target?: ResourceTarget | null;
  duration?: number;
  comment?: string;
};

async function canUpdateTime(
  currentMembership: Membership,
  time: Time,
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();
  const userMembershipId = userMembership.getId();

  const isMembershipInProject = project.isProjectMembership(userMembershipId);

  if (project.isProjectAdmin(currentMembershipId) && isMembershipInProject)
    return true;

  if (currentMembershipId === userMembershipId && isMembershipInProject)
    return true;

  if (currentMembershipId === time.membershipId) return true;

  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update time entry"
  );
}

async function getNewMembership(membershipId: string) {
  const membership = await membershipService.getMembershipById(membershipId);
  if (!membership) throw new BusinessError("NOT_FOUND", "Membership not found");
  return membership;
}

async function getNewProject(projectId: string) {
  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");
  return project;
}

export default async function updateTime(
  id: string,
  {
    membershipId,
    projectId,
    date,
    target,
    duration,
    comment,
  }: updateTimeParams,
  actorMembership: Membership
) {
  const time = await timeService.getTimeById(id);
  if (!time) {
    throw new BusinessError("NOT_FOUND", `Time entry not found`);
  }

  const newMembership = await getNewMembership(
    membershipId || time.membershipId
  );
  const newProject = await getNewProject(projectId || time.projectId);

  await canUpdateTime(actorMembership, time, newMembership, newProject);

  time.update(
    {
      membershipId,
      projectId,
      date: date ? dateOnlyIsoString(new Date(date)) : undefined,
      target,
      duration,
      comment,
    },
    actorMembership
  );

  await timeService.save(time);

  const richTime = await timeService.getRichTime({
    time,
    membership: newMembership,
    project: newProject,
    team: await teamService.getTeamById(newMembership.teamId),
    memberships: await membershipService.getMembershipsByTeam(
      newMembership.teamId
    ),
  });

  return richTime;
}
