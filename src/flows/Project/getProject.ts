import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { memberships, projectAnalytics, projects } from "../../services";
import BussinessError from "../../utils/Rejection";

function canGetProject(currentMembership: Membership, project: Project) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectMembership(currentMembershipId)) return true;
  throw new BussinessError(
    "FORBIDDEN",
    "You are not allowed to get the project"
  );
}

export default async function getProject(id: string, currentUser: User) {
  const project = await projects.getProjectById(id);
  if (!project) {
    throw new BussinessError("NOT_FOUND", "Project not found");
  }

  const currentMembership = await memberships.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BussinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  canGetProject(currentMembership, project);

  project.totalHours = await projectAnalytics.calculateTotalHours(project);
  project.totalAmount = await projectAnalytics.calculateTotalAmount(project);
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
      return Object.assign(m, { membershipTotalHours, membershipTotalAmount });
    })
  );
  return project;
}
