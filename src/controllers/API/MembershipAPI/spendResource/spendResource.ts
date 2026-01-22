import { spendResourceFlow } from "../../../../flows";

export default async function spendResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await spendResourceFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
