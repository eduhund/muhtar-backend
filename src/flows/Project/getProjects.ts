import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectAnalytics, projects } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type GetProjectsFilters = {
  membershipId?: string;
  status?: string;
};

export default async function getProjects(
  { membershipId, status }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const projectQuery: any = {
    teamId,
  };

  const projectList = await projects.getProjects(projectQuery);

  const extentedProjectList = await Promise.all(
    projectList.map(async (project: Project) => {
      project.totalHours = await projectAnalytics.calculateTotalHours(project);
      project.totalAmount = await projectAnalytics.calculateTotalAmount(
        project
      );
      project.memberships = await Promise.all(
        project.memberships.map(async (m) => {
          const membershipTotalHours =
            await projectAnalytics.calculateTotalHoursByMembership(
              project,
              m.membershipId
            );
          const membershipTotalAmount =
            await projectAnalytics.calculateTotalAmountByMembership(
              project,
              m.membershipId
            );
          return Object.assign(m, {
            membershipTotalHours,
            membershipTotalAmount,
          });
        })
      );
      return project;
    })
  );

  return extentedProjectList;
}
