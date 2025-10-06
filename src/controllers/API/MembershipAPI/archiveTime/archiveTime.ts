import { archiveTimeFlow } from "../../../../flows";

export default async function archiveTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await archiveTimeFlow(id, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
