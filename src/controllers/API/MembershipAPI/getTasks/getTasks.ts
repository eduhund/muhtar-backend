import { getTasksFlow } from "../../../../flows";

export default async function getTasks(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getTasksFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
