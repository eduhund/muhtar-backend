import { getResourceFlow } from "../../../../flows";

export default async function getResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getResourceFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
