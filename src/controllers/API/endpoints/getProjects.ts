import { getProjectsFlow } from "../../../flows";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { actorUser } = req.data;
    const { teamId, membershipId, status } = req.query;
    const data = await getProjectsFlow(
      { teamId, membershipId, status },
      actorUser
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
