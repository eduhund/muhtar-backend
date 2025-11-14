import Membership from "../../models/Membership";
import Task from "../../models/Task";
import { taskService } from "../../services";

type GetProjectsFilters = {
  assignedProjectId?: string;
  assignedMembershipId?: string;
};

export default async function getTasks(
  { assignedProjectId, assignedMembershipId }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const taskList = await taskService.getTaskList({
    teamId,
    assignedMembershipId,
    assignedProjectId,
  });

  const extentedTaskList = await Promise.all(
    taskList.map((task: Task) => taskService.getRichTask({ task }))
  );

  return extentedTaskList;
}
