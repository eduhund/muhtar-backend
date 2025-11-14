import { createTaskFlow } from "../../../../flows";

export default async function createTask(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await createTaskFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
