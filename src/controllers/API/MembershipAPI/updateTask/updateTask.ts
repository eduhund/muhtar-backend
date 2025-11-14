import { updateTaskFlow } from "../../../../flows";

export default async function updateTask(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await updateTaskFlow(id, req.body, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
