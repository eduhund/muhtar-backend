import { unbookResourceFlow } from "../../../../flows";

export default async function unbookResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await unbookResourceFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
