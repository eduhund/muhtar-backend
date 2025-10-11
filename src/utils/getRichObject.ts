import Membership from "../models/Membership";

export async function richHistory(
  history: any[],
  teamMemberships: Membership[]
) {
  const actorMembershipsMap = Object.fromEntries(
    teamMemberships.map((m: any) => [m.getId(), m])
  );

  return history.map((historyItem) => {
    const actorMembership = actorMembershipsMap[historyItem.membershipId];
    const richHistoryItem = {
      ...historyItem,
    };

    if (actorMembership) {
      richHistoryItem.membership = {
        id: actorMembership.getId(),
        name: actorMembership.name,
      };
    } else {
      richHistoryItem.membership = {
        id: historyItem.membershipId || null,
        name: "Unknown Membership",
      };
    }

    delete richHistoryItem.membershipId;
    return richHistoryItem;
  });
}

export async function getRichTime({ time, membership, project, team }: any) {
  const richTime = { ...time.toJSON() };
  if (membership) {
    richTime.membership = {
      id: membership.getId(),
      name: membership.name,
    };
  } else {
    richTime.membership = {
      id: richTime.membershipId || null,
      name: "Unknown Membership",
    };
  }

  if (project) {
    richTime.project = {
      id: project.getId(),
      name: project.name,
    };
  } else {
    richTime.project = {
      id: richTime.projectId || null,
      name: "Unknown Project",
    };
  }

  if (team) {
    richTime.team = {
      id: team.getId(),
      name: team.name,
    };
  } else {
    richTime.team = {
      id: richTime.teamId || null,
      name: "Unknown Team",
    };
  }

  delete richTime.membershipId;
  delete richTime.projectId;
  delete richTime.teamId;

  //richTime.history = await richHistory(time.history);

  return richTime;
}
