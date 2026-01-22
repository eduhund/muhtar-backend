import { archiveResourceFlow } from "../../../../flows";

export default async function archiveResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await archiveResourceFlow(id, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
