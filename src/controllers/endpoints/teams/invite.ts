import { inviteUsersFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function invite(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { invitees } = req.body;
    const data = await inviteUsersFlow(id, { invitees }, currentUser);
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
