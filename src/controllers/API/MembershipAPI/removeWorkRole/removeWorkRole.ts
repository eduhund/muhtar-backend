import { removeWorkRoleFlow } from "../../../../flows";

export default async function removeWorkRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { workRoleName } = req.body;
    const data = await removeWorkRoleFlow(id, workRoleName, currentUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
