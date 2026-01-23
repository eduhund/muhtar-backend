import { declineInvitationFlow } from "../../../../flows";

export default async function declineInvitation(req: any, res: any, next: any) {
  try {
    const { teamId } = req.body;
    const { actorUser } = req.data;
    const data = await declineInvitationFlow({ teamId }, actorUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
