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
  assignedMembershipId?: string | null;
  assignedProjectId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  duration?: number | null;
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
    assignedMembershipId,
    assignedProjectId,
    startDate,
    dueDate,
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

  const project = assignedProjectId
    ? await projectService.getProjectById(assignedProjectId!)
    : null;
  if (assignedProjectId && !project)
    throw new BusinessError("NOT_FOUND", "Project not found");

  await canCreateTask(actorMembership, membership, project);

  const taskData = {
    teamId,
    name,
    assignedMembershipId: membership ? membership.getId() : null,
    assignedProjectId: project ? project.getId() : null,
    startDate: startDate || null,
    dueDate: dueDate || null,
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
