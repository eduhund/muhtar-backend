import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Task from "../../models/Task";
import {
  membershipService,
  projectService,
  taskService,
  teamService,
} from "../../services";
import { dateOnlyIsoString } from "../../utils/date";
import { BusinessError } from "../../utils/Rejection";

type updateTaskParams = {
  assignedMembershipId?: string | null;
  projectId?: string;
  jobId?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  duration?: number | null;
  notes?: string;
};

async function canUpdateTask(
  currentMembership: Membership,
  task: Task,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  const isMembershipInProject =
    project.isProjectMembership(currentMembershipId);

  if (projectActorMembershipRole === "admin" && isMembershipInProject)
    return true;

  throw new BusinessError("FORBIDDEN", "You are not allowed to update task");
}

async function getNewAssignedMembership(membershipId: string) {
  const membership = await membershipService.getMembershipById(membershipId);
  if (!membership) throw new BusinessError("NOT_FOUND", "Membership not found");
  return membership;
}

async function getNewProject(projectId: string) {
  const project = await projectService.getProjectById(projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");
  return project;
}

export default async function updateTask(
  id: string,
  {
    assignedMembershipId,
    projectId,
    jobId,
    startDate,
    dueDate,
    duration,
    notes,
  }: updateTaskParams,
  actorMembership: Membership
) {
  const task = await taskService.getTaskById(id);
  if (!task) {
    throw new BusinessError("NOT_FOUND", `Task not found`);
  }

  const newProject = await getNewProject(projectId || task.projectId);

  await canUpdateTask(actorMembership, task, newProject);

  const newAssignedMembership = assignedMembershipId
    ? await getNewAssignedMembership(assignedMembershipId)
    : task.assignedMembershipId;

  const { teamId } = actorMembership;
  const team = await teamService.getTeamById(teamId);
  if (!team) throw new BusinessError("NOT_FOUND", "Team not found");

  task.update(
    {
      assignedMembershipId,
      projectId,
      jobId,
      startDate: startDate ? dateOnlyIsoString(new Date(startDate)) : undefined,
      dueDate: dueDate ? dateOnlyIsoString(new Date(dueDate)) : undefined,
      duration,
      notes,
    },
    actorMembership
  );

  await taskService.save(task);

  const richTask = await taskService.getRichTask({
    task,
    membership: newAssignedMembership,
    project: newProject,
    team: team,
  });

  return richTask;
}
