import { getProjectFlow } from "../../../../flows";

export default async function getProject(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getProjectFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
