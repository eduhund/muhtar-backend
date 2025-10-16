import Membership from "../models/Membership";
import Project from "../models/Project";
import Team from "../models/Team";
import User from "../models/User";
import {
  membershipService,
  projectService,
  teamService,
  userService,
} from "../services";

export async function richHistory(
  history: any[],
  teamMemberships: Membership[]
) {
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

async function getRichUser(object: any, user?: User | null) {
  if (user) {
    const userId = user.getId();
    if (object.membershipId === userId) {
      object.user = {
        id: userId,
        name: user.getFullName(),
      };
      delete object.userId;
    }
    throw new Error("User ID does not match the object's userId");
  } else {
    const findedUser = await userService.getUserById(object.userId);
    if (findedUser) {
      const findedUserId = findedUser.getId();
      object.user = {
        id: findedUserId,
        name: findedUser.getFullName(),
      };
      delete object.userId;
    } else {
      throw new Error("User not found");
    }
  }
  return object;
}

async function getRichMembership(object: any, membership?: Membership | null) {
  if (membership) {
    const membershipId = membership.getId();
    if (object.membershipId === membershipId) {
      object.membership = {
        id: membershipId,
        name: membership.name,
      };
      delete object.membershipId;
    }
    throw new Error("Membership ID does not match the object's membershipId");
  } else {
    const findedMembership = await membershipService.getMembershipById(
      object.membershipId
    );
    if (findedMembership) {
      const findedMembershipId = findedMembership.getId();
      object.membership = {
        id: findedMembershipId,
        name: findedMembership.name,
      };
      delete object.membershipId;
    } else {
      throw new Error("Membership not found");
    }
  }
  return object;
}

async function getRichProject(object: any, project?: Project | null) {
  if (project) {
    const projectId = project.getId();
    if (object.projectId === projectId) {
      object.project = {
        id: projectId,
        name: project.name,
        customer: project.customer,
      };
      delete object.project;
    }
    throw new Error("Project ID does not match the object's projectId");
  } else {
    const findedProject = await projectService.getProjectById(object.projectId);
    if (findedProject) {
      const findedProjectId = findedProject.getId();
      object.project = {
        id: findedProjectId,
        name: findedProject.name,
        customer: findedProject.customer,
      };
      delete object.projectId;
    } else {
      throw new Error("Project not found");
    }
  }
  return object;
}

async function getRichTeam(object: any, team?: Team | null) {
  if (team) {
    const teamId = team.getId();
    if (object.teamId === teamId) {
      object.team = {
        id: teamId,
        name: team.name,
      };
      delete object.teamId;
    }
    throw new Error("Team ID does not match the object's teamId");
  } else {
    const findedTeam = await teamService.getTeamById(object.teamId);
    if (findedTeam) {
      const findedTeamId = findedTeam.getId();
      object.team = {
        id: findedTeamId,
        name: findedTeam.name,
      };
      delete object.teamId;
    } else {
      throw new Error("Team not found");
    }
  }
  return object;
}

export async function getRichObject({
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
  richObject.userId && (await getRichUser(richObject, user));
  richObject.membershipId && (await getRichMembership(richObject, membership));
  richObject.projectId && (await getRichProject(richObject, project));
  richObject.teamId && (await getRichTeam(richObject, team));

  //richTime.history = await richHistory(time.history);

  return richObject;
}
