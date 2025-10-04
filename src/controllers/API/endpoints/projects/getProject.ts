import { getProjectFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function getProject(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const data = await getProjectFlow(id, currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
