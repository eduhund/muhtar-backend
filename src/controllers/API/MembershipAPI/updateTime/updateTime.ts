import { updateTimeFlow } from "../../../../flows";

export default async function updateTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await updateTimeFlow(id, req.body, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
