import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectService, taskService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

async function canArchiveTask(currentMembership: Membership, project: Project) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const projectActorMembershipRole = project.getProjectMembershipRole(
    currentMembership.getId()
  );

  if (projectActorMembershipRole === "admin") return true;

  throw new BusinessError("FORBIDDEN", "You are not allowed to archive task");
}

export default async function archiveTask(
  id: string,
  actorMembership: Membership
) {
  const task = await taskService.getTaskById(id);
  if (!task) {
    throw new BusinessError("NOT_FOUND", `Task not found`);
  }

  const project = await projectService.getProjectById(task.projectId);
  if (!project) throw new BusinessError("NOT_FOUND", "Project not found");

  await canArchiveTask(actorMembership, project);

  task.archive(actorMembership);
  await taskService.save(task);

  return task;
}
