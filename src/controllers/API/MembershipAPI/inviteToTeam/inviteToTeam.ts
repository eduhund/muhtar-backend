import { inviteUsersFlow } from "../../../../flows";
import { withUser } from "../../UserAPI/utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { invitees } = req.body;
  return inviteUsersFlow({ invitees }, actorUser);
});
