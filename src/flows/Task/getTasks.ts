import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Task from "../../models/Task";
import {
  membershipService,
  projectService,
  taskService,
  teamService,
} from "../../services";

type GetProjectsFilters = {
  projectId: string;
  assignedMembershipId?: string;
};

export default async function getTasks(
  { projectId, assignedMembershipId }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const projects = (await projectService.getProjectsByTeam(
    teamId
  )) as Project[];
  const team = await teamService.getTeamById(teamId);
  const memberships = await membershipService.getMembershipsByTeam(teamId);

  const taskList = await taskService.getTasks({
    teamId,
    projectId,
    assignedMembershipId,
  });

  const extentedTaskList = taskList.map((task: Task) => {
    const membership = memberships.find(
      (m: Membership) => m.getId() === task.assignedMembershipId
    );
    const project = projects.find((p: Project) => p.getId() === task.projectId);
    return taskService.getRichTask({ task, membership, project, team });
  });

  return extentedTaskList;
}
