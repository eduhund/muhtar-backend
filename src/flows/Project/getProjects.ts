import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { memberships, projectAnalytics, projects } from "../../services";
import BussinessError from "../../utils/Rejection";

type GetProjectsFilters = {
  teamId: string;
  membershipId?: string;
  status?: string;
};

function canGetTeamProjects(currentMembership: Membership) {
  return currentMembership.isOwner() || currentMembership.isAdmin();
}

export default async function getProjects(
  { teamId, membershipId, status }: GetProjectsFilters,
  currentUser: User
) {
  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BussinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  const currentMembershipId = currentMembership.getId();

  if (membershipId && membershipId !== currentMembershipId) {
    const membership = await memberships.getMembershipById(membershipId);
    if (!membership) {
      throw new BussinessError("NOT_FOUND", "Membership not found");
    }
    if (!membership.isMembershipOfTeam(teamId)) {
      throw new BussinessError(
        "FORBIDDEN",
        "Membership is not part of the team"
      );
    }
  }

  const projectQuery: any = {
    teamId,
  };

  if (membershipId) {
    projectQuery.membershipId =
      canGetTeamProjects(currentMembership) && membershipId
        ? membershipId
        : currentMembershipId;
  }

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
