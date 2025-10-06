import { restoreTimeFlow } from "../../../../flows";

export default async function restoreTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await restoreTimeFlow(id, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
