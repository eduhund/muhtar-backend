import { memberships } from "../services";

async function richHistory(history: any[]) {
  const actorMembershipIds = [
    ...new Set(
      history
        .map((h) => h.membershipId)
        .filter((id: string) => id !== undefined)
    ),
  ];
  const actorMemberships = await Promise.all(
    actorMembershipIds.map((membershipId: string) =>
      memberships.getMembershipById(membershipId)
    )
  );
  const actorMembershipsMap = Object.fromEntries(
    actorMemberships.map((m: any) => [m.getId(), m])
  );

  return history.map((entry) => {
    const actorMembership = actorMembershipsMap[entry.membershipId];
    const richHistoryItem = {
      ...entry,
    };

    if (actorMembership) {
      richHistoryItem.membership = {
        id: actorMembership.getId(),
        name: actorMembership.name,
      };
    } else {
      richHistoryItem.membership = {
        id: entry.membershipId || null,
        name: "Unknown Membership",
      };
    }

    delete richHistoryItem.membershipId;
    return richHistoryItem;
  });
}

export async function getRichTime({ time, membership, project, team }: any) {
  const richTime = { ...time.toPublicJSON() };
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

  if (!project) {
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

  richTime.history = await richHistory(time.history);

  return richTime;
}
