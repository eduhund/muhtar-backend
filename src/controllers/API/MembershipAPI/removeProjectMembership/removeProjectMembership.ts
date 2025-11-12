import { removeProjectMembershipFlow } from "../../../../flows";

export default async function removeProjectMembership(
  req: any,
  res: any,
  next: any
) {
  try {
    const { actorMembership } = req.data;
    const { projectId, membershipId } = req.body;
    const data = await removeProjectMembershipFlow(
      projectId,
      membershipId,
      actorMembership
    );
    return next({ data });
  } catch (e) {
    next(e);
  }
}
