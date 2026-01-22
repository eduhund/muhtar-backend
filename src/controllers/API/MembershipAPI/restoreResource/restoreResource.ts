import { restoreResourceFlow } from "../../../../flows";

export default async function restoreResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await restoreResourceFlow(id, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
