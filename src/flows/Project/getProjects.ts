import Membership from "../../models/Membership";
import Project from "../../models/Project";
import {
  projectContractService,
  projectPlanService,
  projectService,
} from "../../services";

type GetProjectsFilters = {
  membershipId?: string;
  status?: string;
};

export default async function getProjects(
  { membershipId, status }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const projectList = await projectService.getProjects({
    teamId,
    membershipId,
    status,
  });

  const extentedProjectList = await Promise.all(
    projectList.map(async (project: Project) => {
      const activePlan = project.activePlanId
        ? await projectPlanService.getPlanById(project.activePlanId)
        : null;
      const activeContract = project.activeContractId
        ? await projectContractService.getContractById(project.activeContractId)
        : null;
      return projectService.getRichProject({
        project,
        activePlan,
        activeContract,
      });
    })
  );

  return extentedProjectList;
}
