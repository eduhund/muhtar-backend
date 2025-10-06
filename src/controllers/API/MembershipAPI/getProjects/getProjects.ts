import { getProjectsFlow } from "../../../../flows";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getProjectsFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
