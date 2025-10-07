import { removeMembershipFromTeamFlow } from "../../../../flows";

export default async function changeAccessRole(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { membershipId } = req.body;
    await removeMembershipFromTeamFlow(id, membershipId, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
