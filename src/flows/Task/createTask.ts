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
  userMembership: Membership,
  project: Project
) {
  if (currentMembership.isAdmin()) return true;
  if (project.visibility === "team") return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
    currentMembership.getId()
  );

  const isMembershipInProject = project.isProjectMembership(
    userMembership.getId()
  );

  if (projectActorMembershipRole === "admin" && isMembershipInProject)
    return true;

  if (
    currentMembership.getId() === userMembership.getId() &&
    isMembershipInProject
  )
    return true;

  throw new BusinessError("FORBIDDEN", "User is not allowed to add time");
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
    : actorMembership;

  if (!membership) {
    throw new BusinessError("NOT_FOUND", "Membership not found");
  }
  const { teamId } = membership;

  const project = await projectService.getProjectById(assignedProjectId!);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  const team = await teamService.getTeamById(teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  await canCreateTask(actorMembership, membership, project);

  const taskData = {
    teamId,
    name,
    assignedMembershipId: membership.getId(),
    assignedProjectId,
    startDate: startDate || null,
    dueDate: dueDate || null,
    duration: duration || 0,
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
