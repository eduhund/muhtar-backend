import { removeMembershipFromProjectFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function changeAccessRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { membershipId } = req.body;
    await removeMembershipFromProjectFlow(id, membershipId, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(errorHandler(e));
  }
}
