import { getTimeFlow } from "../../../../flows";

export default async function getTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getTimeFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
