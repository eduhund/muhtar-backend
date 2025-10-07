import { restoreProjectFlow } from "../../../../flows";

export default async function restoreProject(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    await restoreProjectFlow(id, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
