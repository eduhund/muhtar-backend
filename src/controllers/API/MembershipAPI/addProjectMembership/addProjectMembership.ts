import { addProjectMembershipFlow } from "../../../../flows";

export default async function addProjectMembership(
  req: any,
  res: any,
  next: any
) {
  try {
    const { actorMembership } = req.data;
    const { projectId, membershipId, accessRole, workRole, multiplier } =
      req.body;
    const data = await addProjectMembershipFlow(
      projectId,
      { membershipId, accessRole, workRole, multiplier },
      actorMembership
    );
    return next({ data });
  } catch (e) {
    next(e);
  }
}
