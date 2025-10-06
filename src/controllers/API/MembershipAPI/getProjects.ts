import { getProjectsFlow } from "../../../flows";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { membershipId, status } = req.query;
    const data = await getProjectsFlow(
      { membershipId, status },
      actorMembership
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
