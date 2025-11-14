import { restoreTaskFlow } from "../../../../flows";

export default async function restoreTask(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await restoreTaskFlow(id, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
