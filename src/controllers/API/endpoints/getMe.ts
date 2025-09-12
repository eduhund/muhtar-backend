import { getCurrentUserFlow } from "../../../flows";
import { errorHandler } from "../responses";

export default async function getMe(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const data = await getCurrentUserFlow(currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
