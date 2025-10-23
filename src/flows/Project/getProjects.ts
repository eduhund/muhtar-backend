import Membership from "../../models/Membership";
import Project from "../../models/Project";
import { projectService } from "../../services";
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

  const projectList = await projectService.getProjects({
    teamId,
    membershipId,
    status,
  });

  let filteredProjectList: Project[] = [];

  if (actorMembership.isAdmin()) {
    filteredProjectList = projectList;
  } else {
    const actorMembershipId = actorMembership.getId();

    filteredProjectList = projectList.filter(
      (project: Project) =>
        project.visibility === "team" ||
        (Array.isArray(project.memberships) &&
          project.memberships.some(
            (m: any) => m.membershipId === actorMembershipId
          ))
    );
  }

  const extentedProjectList = await Promise.all(
    filteredProjectList.map((project: Project) =>
      projectService.getRichProject({ project })
    )
  );

  return extentedProjectList;
}
