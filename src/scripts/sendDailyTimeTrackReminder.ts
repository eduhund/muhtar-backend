import Team from "../models/Team";
import { memberships, teams, time } from "../services";
import { getPreviousWorkday, isDayWorkday } from "../utils/isDayOff";

function groupMembershipsByTeamId(membershipsList: any[]) {
  return membershipsList.reduce(
    (acc: Record<string, any[]>, membership: any) => {
      const teamId = membership.teamId;
      if (!acc[teamId]) {
        acc[teamId] = [];
      }
      acc[teamId].push(membership);
      return acc;
    },
    {}
  );
}

export default async function sendDailyTimeTrackReminder() {
  if (!(await isDayWorkday())) return;
  const previusWorkday = getPreviousWorkday();
  const teamsList = await teams.getAllActiveTeams();
  const membershipsList = await memberships.getAllActiveMemberships();

  const membershipsByTeam = groupMembershipsByTeamId(membershipsList);
  for (const [teamId, memberships] of Object.entries(membershipsByTeam)) {
    const team = teamsList.find((t: Team) => t.getId() === teamId);
    if (!team || !team?.connections?.slack?.teamId) continue;

    const membersToRemind: string[] = [];
    for (const membership of memberships) {
      if (!membership.connections?.slack?.userId) continue;
      if (membership.contract?.status === "bench") continue;
      const timeList = await time.getTimeList({
        teamId,
        membershipId: membership.getId(),
        from: previusWorkday,
      });

      if (timeList.length === 0) {
        membersToRemind.push(membership.connections?.slack?.userId);
      }
    }
    console.log(
      `Reminding ${membersToRemind.length} members in team ${team.name} (${teamId})`
    );
  }
}
