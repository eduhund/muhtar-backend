import { updateProjectMembershipFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function addMemberships(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { membershipId, workRole, multiplier } = req.body;
    await updateProjectMembershipFlow(
      id,
      membershipId,
      { workRole, multiplier },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(errorHandler(e));
  }
}
