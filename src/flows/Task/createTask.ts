import Membership from "../../models/Membership";
import Project from "../../models/Project";
import {
  projectService,
  teamService,
  membershipService,
  taskService,
} from "../../services";
import { BusinessError } from "../../utils/Rejection";

type createTaskParams = {
  name: string;
  projectId: string;
  assignedMembershipId?: string | null;
  jobId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  doneDate?: string | null;
  duration?: number | [number, number] | null;
  notes?: string | null;
  history?: any[];
};

async function canCreateTask(
  currentMembership: Membership,
  userMembership: Membership | null,
  project: Project | null
) {
  return true;
}

export default async function createTask(
  {
    name,
    projectId,
    assignedMembershipId,
    jobId,
    startDate,
    dueDate,
    doneDate,
    duration,
    notes,
    history,
  }: createTaskParams,
  actorMembership: Membership
) {
  const membership = assignedMembershipId
    ? await membershipService.getMembershipById(assignedMembershipId)
    : null;

  if (assignedMembershipId && !membership) {
    throw new BusinessError("NOT_FOUND", "Membership not found");
  }
  const { teamId } = actorMembership;

  const team = await teamService.getTeamById(teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canCreateTask(actorMembership, membership, project);

  const taskData = {
    teamId,
    projectId,
    jobId,
    name,
    assignedMembershipId: membership ? membership.getId() : null,
    startDate: startDate ? new Date(startDate).toISOString() : null,
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    doneDate: doneDate ? new Date(doneDate).toISOString() : null,
    duration: duration || null,
    notes: notes || "",
    history: history || [],
  };

  const newTask = await taskService.create(taskData, actorMembership);

  const richTask = await taskService.getRichTask({
    task: newTask,
    membership,
    project,
    team,
    memberships: [membership],
  });

  return richTask;
}
