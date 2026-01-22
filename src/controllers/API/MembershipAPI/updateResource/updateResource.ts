import { updateResourceFlow } from "../../../../flows";

export default async function updateResource(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { id } = req.body;
    await updateResourceFlow(id, req.body, actorMembership);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
