import { acceptInvitationFlow } from "../../../../flows";

export default async function acceptInvitation(req: any, res: any, next: any) {
  try {
    const { teamId } = req.body;
    const { actorUser } = req.data;
    const data = await acceptInvitationFlow({ teamId }, actorUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
