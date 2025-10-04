import { updateWorkRoleFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function updateWorkRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { workRoleName, update } = req.body;
    const data = await updateWorkRoleFlow(
      id,
      workRoleName,
      update,
      currentUser
    );
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
