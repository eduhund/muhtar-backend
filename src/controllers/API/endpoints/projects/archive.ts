import { archiveProjectFlow } from "../../../../flows";

export default async function archiveProject(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    await archiveProjectFlow(id, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
