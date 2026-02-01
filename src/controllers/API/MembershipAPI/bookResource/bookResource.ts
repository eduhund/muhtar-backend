import { bookResourceFlow } from "../../../../flows";

export default async function bookResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await bookResourceFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
