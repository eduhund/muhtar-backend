import { addWorkRoleFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function addWorkRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { workRole } = req.body;
    const data = await addWorkRoleFlow(id, workRole, currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
