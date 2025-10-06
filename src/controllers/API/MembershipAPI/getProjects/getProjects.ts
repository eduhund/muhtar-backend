import { getProjectFlow, getProjectsFlow } from "../../../../flows";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.query;
    const data = id
      ? await getProjectFlow(id, actorMembership)
      : await getProjectsFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
