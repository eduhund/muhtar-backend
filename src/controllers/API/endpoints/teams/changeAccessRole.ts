import { changeMembershipAccessRoleFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function changeAccessRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { membershipId, accessRole } = req.body;
    await changeMembershipAccessRoleFlow(
      id,
      { membershipId, accessRole },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(errorHandler(e));
  }
}
