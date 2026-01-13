import { getResourcesFlow } from "../../../../flows";

export default async function getResources(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getResourcesFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
