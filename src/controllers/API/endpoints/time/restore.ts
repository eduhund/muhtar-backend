import { restoreTimeFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function restoreTime(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    await restoreTimeFlow(id, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(errorHandler(e));
  }
}
