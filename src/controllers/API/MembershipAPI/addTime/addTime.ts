import { addTimeFlow } from "../../../../flows";

export default async function addTime(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await addTimeFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
