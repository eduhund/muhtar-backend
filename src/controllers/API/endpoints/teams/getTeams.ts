import { getTeamsFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const data = await getTeamsFlow(currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
