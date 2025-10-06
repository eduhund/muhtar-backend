import { getTimeListFlow } from "../../../../flows";

export default async function getTimeList(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getTimeListFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
