import { getTimeFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function getTimeList(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const data = await getTimeFlow(id, currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
