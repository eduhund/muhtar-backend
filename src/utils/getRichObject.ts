import Membership from "../models/Membership";
import Project from "../models/Project";
import Task from "../models/Task";
import Team from "../models/Team";
import Time from "../models/Resource";
import User from "../models/User";
import { membershipService, timeService } from "../services";

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

export function getRichHistory(history: any[], teamMemberships: Membership[]) {
  const actorMembershipsMap = Object.fromEntries(
    teamMemberships.map((m: any) => [m.getId(), m])
  );

  return history.map((historyItem) => {
    const actorMembership = actorMembershipsMap[historyItem.actorId];
    const richHistoryItem = {
      ...historyItem,
    };

    if (actorMembership) {
      richHistoryItem.actor = {
        id: actorMembership.getId(),
        name: actorMembership.name,
        type: historyItem.actorType,
      };
    } else {
      richHistoryItem.actor = {
        id: historyItem.membershipId || null,
        name:
          historyItem.actorType === "AUTO" ? "System event" : "Unknown actor",
        type: historyItem.actorType,
      };
    }

    delete richHistoryItem.actorId;
    delete richHistoryItem.actorType;
    return richHistoryItem;
  });
}

export async function getRichMembershipList(project: Project) {
  const projectTimeList = await timeService.getTimeByProject(project.getId());
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
      const membership = await membershipService.getMembershipById(
        m.membershipId
      );
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
      const membership = await membershipService.getMembershipById(
        membershipId
      );
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

export function getRichUser(object: any, user?: User | null) {
  if (user) {
    const userId = user.getId();
    if (object.membershipId === userId) {
      object.user = {
        id: userId,
        name: user.getFullName(),
      };
      delete object.userId;
    } else throw new Error("User ID does not match the object's userId");
  } else {
    object.user = null;
    delete object.userId;
  }
  return object;
}

export function getRichMembership(object: any, membership?: Membership | null) {
  if (membership) {
    const membershipId = membership.getId();
    if (object.membershipId === membershipId) {
      object.membership = {
        id: membershipId,
        name: membership.name,
      };
      delete object.membershipId;
    } else
      throw new Error("Membership ID does not match the object's membershipId");
  } else {
    object.membership = null;
    delete object.membershipId;
  }
  return object;
}

export function getRichProject(object: any, project?: Project | null) {
  if (project) {
    const projectId = project.getId();
    if (object.projectId === projectId) {
      object.project = {
        id: projectId,
        name: project.name,
        customer: project.customer,
      };
      delete object.projectId;
    } else throw new Error("Project ID does not match the object's projectId");
  } else {
    object.project = null;
    delete object.projectId;
  }
  return object;
}

export function getRichTeam(object: any, team?: Team | null) {
  if (team) {
    const teamId = team.getId();
    if (object.teamId === teamId) {
      object.team = {
        id: teamId,
        name: team.name,
      };
      delete object.teamId;
    } else throw new Error("Team ID does not match the object's teamId");
  } else {
    object.team = null;
    delete object.teamId;
  }
  return object;
}

export function getRichTask(object: any, task?: Task | null) {
  if (task) {
    const taskId = task.getId();
    if (object.taskId === taskId) {
      object.task = {
        id: taskId,
        name: task.name,
      };
      delete object.taskId;
    } else throw new Error("Task ID does not match the object's taskId");
  } else {
    object.task = null;
    delete object.taskId;
  }
  return object;
}

export function getRichObject({
  baseObject,
  user,
  membership,
  project,
  team,
}: {
  baseObject: any;
  user?: User | null;
  membership?: Membership | null;
  project?: Project | null;
  team?: Team | null;
}) {
  const richObject = { ...baseObject.toJSON() };
  richObject.userId && getRichUser(richObject, user);
  richObject.membershipId && getRichMembership(richObject, membership);
  richObject.projectId && getRichProject(richObject, project);
  richObject.teamId && getRichTeam(richObject, team);

  return richObject;
}
