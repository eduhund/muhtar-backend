import Membership from "../../models/Membership";
import Task from "../../models/Task";
import { taskService } from "../../services";

type GetProjectsFilters = {
  projectId: string;
  assignedMembershipId?: string;
};

export default async function getTasks(
  { projectId, assignedMembershipId }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const taskList = await taskService.getTasks({
    teamId,
    projectId,
    assignedMembershipId,
  });

  const extentedTaskList = taskList.map((task: Task) =>
    taskService.getRichTask({ task })
  );

  return extentedTaskList;
}
