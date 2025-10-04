import { getProjectsFlow } from "../../../flows";

export default async function getTeamProjects(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const { teamId, membershipId, status } = req.query;
    const data = await getProjectsFlow(
      { teamId, membershipId, status },
      currentUser
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
