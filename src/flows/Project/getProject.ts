import Membership from "../../models/Membership";
import Project from "../../models/Project";
import Time from "../../models/Time";
import { memberships, projects, time } from "../../services";
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

async function richProject(project: Project) {
  const projectTimeList = await time.getTimeByProject(project.getId());
  const timelistPerMembership = groupTimeByMembership(projectTimeList);
  const totalSpentTime = Object.values(timelistPerMembership).reduce(
    (sum: number, { totalValue }) => sum + totalValue,
    0
  );

  const projectMembershipIds = new Set(
    project.memberships.map((m) => m.membershipId)
  );

  const projectMemberships = await Promise.all(
    project.memberships.map(async (m) => {
      const membership = await memberships.getMembershipById(m.membershipId);
      const membershipTotalSpentTime =
        timelistPerMembership[m.membershipId]?.totalValue || 0;
      return Object.assign(m, {
        name: membership?.name || "Unknown Membership",
        membershipTotalSpentTime,
      });
    })
  );

  const guestMembershipIds = Object.keys(timelistPerMembership).filter(
    (id) => !projectMembershipIds.has(id)
  );

  const projectGuests = await Promise.all(
    guestMembershipIds.map(async (membershipId) => {
      const membership = await memberships.getMembershipById(membershipId);
      const membershipTotalSpentTime =
        timelistPerMembership[membershipId]?.totalValue || 0;
      return {
        membershipId,
        name: membership?.name || "Unknown Membership",
        membershipTotalSpentTime,
        timeList: timelistPerMembership[membershipId].list,
      };
    })
  );

  return Object.assign(project, {
    memberships: projectMemberships,
    guests: projectGuests,
    totalSpentTime,
  });
}

export default async function getProject(
  { id }: { id: string },
  actorMembership: Membership
) {
  const project = await projects.getProjectById(id);

  if (!project) return;

  return canGetProject(actorMembership, project)
    ? richProject(project)
    : undefined;
}
