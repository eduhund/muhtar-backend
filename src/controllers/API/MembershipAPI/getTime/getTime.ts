import { getTimeFlow, getTimeListFlow } from "../../../../flows";

export default async function getTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.query;
    const data = id
      ? await getTimeFlow(id, actorMembership)
      : await getTimeListFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
