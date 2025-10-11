import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projects } from "../../services";
import getProject from "./getProject";

type GetProjectsFilters = {
  membershipId?: string;
  status?: string;
};

export default async function getProjects(
  { membershipId, status }: GetProjectsFilters,
  actorMembership: Membership
) {
  const { teamId } = actorMembership;

  const projectList = await projects.getProjects({
    teamId,
    membershipId,
    status,
  });

  const extentedProjectList = await Promise.all(
    projectList.map((project: Project) =>
      getProject({ id: project.getId() }, actorMembership)
    )
  );

  return extentedProjectList;
}
