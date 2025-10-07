import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { memberships, projectAnalytics, projects, time } from "../../services";
import { BusinessError } from "../../utils/Rejection";

function canGetProject(currentMembership: Membership, project: Project) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  if (project.isProjectMembership(currentMembershipId)) return true;
  return false;
}

function groupTimeByMembership(projectTimeList: Time[]) {
  const timelistPerMembership: Record<
    string,
    { list: Time[]; totalValue: number }
  > = {};

  for (const entry of projectTimeList) {
    const { membershipId, duration } = entry;
    if (!timelistPerMembership[membershipId]) {
      timelistPerMembership[membershipId] = { list: [], totalValue: 0 };
    }
    timelistPerMembership[membershipId].list.push(entry);
    timelistPerMembership[membershipId].totalValue += duration;
  }

  return timelistPerMembership;
}

export default async function getProject(
  id: string,
  actorMembership: Membership
) {
  const project = await projects.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", "Project not found");
  }

  if (!canGetProject(actorMembership, project)) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not allowed to get the project"
    );
  }

  const projectTimeList = await time.getTimeByProject(id);
  const timelistPerMembership = groupTimeByMembership(projectTimeList);

  project.memberships = await Promise.all(
    project.memberships.map(async (m) => {
      const membership = await memberships.getMembershipById(m.membershipId);
      const membershipTotalSpentTime =
        timelistPerMembership[m.membershipId].totalValue || 0;
      return Object.assign(m, {
        name: membership?.name || "Unknown Membership",
        membershipTotalSpentTime,
      });
    })
  );
  return project;
}
