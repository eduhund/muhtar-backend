import { inviteUsersFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { id } = req.params;
  const { actorUser } = req.data;
  const { invitees } = req.body;
  return inviteUsersFlow(id, { invitees }, actorUser);
});
