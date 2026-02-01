import { rebookResourceFlow } from "../../../../flows";

export default async function rebookResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await rebookResourceFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
